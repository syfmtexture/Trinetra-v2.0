"""
reality_defender.py — Reality Defender Cloud API Wrapper with Multi-Key Rotation.

Features:
- Thread-safe key rotation (Round-robin)
- Automatic blacklisting of rate-limited (429) keys
- Exponential backoff on transient errors
- Pre-validation of file size/type
- Structured forensic results
"""

import asyncio
import logging
import os
import threading
import time
from dataclasses import dataclass, field
from typing import Optional

from realitydefender import RealityDefender, RealityDefenderError

from src.core.config import (
    RD_API_KEYS,
    RD_MAX_AUDIO_SIZE_MB,
    RD_MAX_DOC_SIZE_MB,
    RD_MAX_IMAGE_SIZE_MB,
    RD_MAX_VIDEO_SIZE_MB,
    RD_RETRY_DELAY,
    RD_SUPPORTED_EXTENSIONS,
    RD_TIMEOUT,
)

# ── Logging Configuration ──
logger = logging.getLogger("Trinetra.RealityDefender")
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# ──────────────────────────────────────────────
#  Result Dataclass
# ──────────────────────────────────────────────

@dataclass
class RDResult:
    """Normalized Reality Defender API response."""
    status: str = "ERROR"        # "MANIPULATED" | "AUTHENTIC" | "INCONCLUSIVE" | "ERROR"
    overall_score: float = 0.0   # 0.0-1.0 (higher = more likely manipulated)
    models: list[dict] = field(default_factory=list)
    request_id: str = ""
    key_used_index: int = -1
    attempts: int = 0
    latency_ms: float = 0.0
    error: Optional[str] = None

# ──────────────────────────────────────────────
#  Key Rotator
# ──────────────────────────────────────────────

class KeyRotator:
    """Thread-safe round-robin key management with local blacklisting."""
    
    def __init__(self, keys: list[str]):
        self._keys = keys
        self._index = 0
        self._blacklist: dict[str, float] = {}  # key -> blacklisted_until
        self._lock = threading.Lock()

    def get_next(self) -> tuple[Optional[str], int]:
        """
        Thread-safe fetch of the next non-blacklisted key.
        Returns (key_string, key_index) or (None, -1) if all exhausted.
        """
        with self._lock:
            now = time.time()
            # Clean up expired entries in blacklist
            self._blacklist = {k: expiry for k, expiry in self._blacklist.items() if expiry > now}
            
            n = len(self._keys)
            for _ in range(n):
                idx = self._index % n
                self._index += 1
                key = self._keys[idx]
                
                if key not in self._blacklist:
                    return key, idx
            
            return None, -1

    def blacklist(self, key: str, duration: float = 60.0):
        """Temporarily remove a key from rotation."""
        with self._lock:
            self._blacklist[key] = time.time() + duration
            logger.warning(f"Key rotated out: '{key[:8]}...' blacklisted for {duration}s (Rate Limit).")

# Singleton instance
rotator = KeyRotator(RD_API_KEYS)

# ──────────────────────────────────────────────
#  Analysis Logic
# ──────────────────────────────────────────────

async def _analyze_async(file_path: str) -> RDResult:
    """Internal async logic: uploads and polls across multiple keys."""
    t_start = time.perf_counter()
    attempts = 0
    
    # 1. Validation
    ext = os.path.splitext(file_path)[1].lower()
    if ext not in RD_SUPPORTED_EXTENSIONS:
        return RDResult(error=f"Unsupported extension: {ext}", status="ERROR")
    
    size_mb = os.path.getsize(file_path) / (1024 * 1024)
    # Generic size check (RD limits vary by type)
    is_video = ext in {".mp4", ".mov"}
    is_audio = ext in {".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac", ".alac"}
    is_image = ext in {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    
    limit = RD_MAX_VIDEO_SIZE_MB if is_video else \
            RD_MAX_AUDIO_SIZE_MB if is_audio else \
            RD_MAX_IMAGE_SIZE_MB if is_image else \
            RD_MAX_DOC_SIZE_MB
            
    if size_mb > limit:
        return RDResult(error=f"File too large: {size_mb:.2f}MB (Limit: {limit}MB)", status="ERROR")

    # 2. Main key-pool loop
    while True:
        key, key_idx = rotator.get_next()
        if not key:
            return RDResult(
                error="All API keys exhausted or rate-limited.",
                attempts=attempts,
                status="ERROR"
            )
        
        attempts += 1
        logger.info(f"Attempting analysis with key #{key_idx} (Attempt {attempts})...")
        
        try:
            rd = RealityDefender(api_key=key)
            
            # Use retry logic for transient network issues
            for retry in range(3):
                try:
                    # Upload
                    upload_resp = await rd.upload(file_path=file_path)
                    req_id = upload_resp["request_id"]
                    
                    # Poll for result
                    # Note: rd.get_result usually implements internal polling
                    result_data = await rd.get_result(req_id)
                    
                    t_end = time.perf_counter()
                    return RDResult(
                        status=result_data.get("status", "INCONCLUSIVE"),
                        overall_score=result_data.get("score", 0.0),
                        models=result_data.get("models", []),
                        request_id=req_id,
                        key_used_index=key_idx,
                        attempts=attempts,
                        latency_ms=(t_end - t_start) * 1000,
                        error=None
                    )
                except RealityDefenderError as e:
                    # Handle Rate Limit specifically
                    if "429" in str(e) or "rate" in str(e).lower():
                        rotator.blacklist(key)
                        break # Break retry loop, go to next key in while loop
                    
                    # Transient errors -> retry
                    if retry < 2:
                        wait = RD_RETRY_DELAY * (2 ** retry)
                        logger.warning(f"Transient error on key #{key_idx}: {e}. Retrying in {wait}s...")
                        await asyncio.sleep(wait)
                    else:
                        raise # Exhausted retries for this key
                except Exception as e:
                    logger.error(f"Unexpected error with key #{key_idx}: {e}")
                    raise

        except Exception as e:
            logger.error(f"Analysis iteration failed with key #{key_idx}: {e}")
            if attempts >= len(RD_API_KEYS):
                break
            continue # Try next key

    return RDResult(error="Analysis failed after trying all keys.", attempts=attempts, status="ERROR")

def analyze_with_rd(file_path: str) -> RDResult:
    """
    Main entry point for synchronous callers (like Gradio callbacks).
    Wraps the async logic and handles timeouts.
    """
    try:
        return asyncio.run(asyncio.wait_for(_analyze_async(file_path), timeout=RD_TIMEOUT))
    except asyncio.TimeoutError:
        logger.error(f"Reality Defender analysis timed out after {RD_TIMEOUT}s")
        return RDResult(error=f"Analysis timed out after {RD_TIMEOUT}s", status="ERROR")
    except Exception as e:
        logger.error(f"Analysis fatal error: {e}")
        return RDResult(error=str(e), status="ERROR")

if __name__ == "__main__":
    # Small test harness
    import sys
    if len(sys.argv) > 1:
        test_file = sys.argv[1]
        print(f"Testing Reality Defender integration on: {test_file}")
        res = analyze_with_rd(test_file)
        print(f"Result: {res}")
    else:
        print("Usage: python reality_defender.py <path_to_media>")
