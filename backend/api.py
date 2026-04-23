from __future__ import annotations
"""
api.py — FastAPI Backend for Trinetra Chrome Extension.

Provides a REST endpoint for the extension to send cropped image regions
for deepfake analysis using the local hybrid model.
"""

import os
import sys
import uuid
import base64
import time
import io
import asyncio
import numpy as np
from typing import Optional, List, Any, TYPE_CHECKING

# Ensure 'backend' directory is in PYTHONPATH so 'src' can be imported correctly
_script_dir = os.path.dirname(os.path.abspath(__file__))
if _script_dir not in sys.path:
    sys.path.append(_script_dir)

if TYPE_CHECKING:
    # Stubs for the IDE when libraries are not indexed/installed
    class BaseModel: 
        def __init__(self, **kwargs: Any) -> None: ...
    class FastAPI: 
        def __init__(self, title: str) -> None: ...
        def add_middleware(self, *args: Any, **kwargs: Any) -> None: ...
        def post(self, *args: Any, **kwargs: Any) -> Any: ...
        def get(self, *args: Any, **kwargs: Any) -> Any: ...
    class HTTPException(Exception):
        def __init__(self, status_code: int, detail: str) -> None: ...
    class CORSMiddleware: ...
    class Image:
        class Image:
            def save(self, *args: Any, **kwargs: Any) -> Any: ...
    # Add src stubs
    def run_inference(*args: Any, **kwargs: Any) -> Any: ...
    class InferenceResult:
        fake_probability: float = 0.0
        label: str = ""
        face_crop: Any = None
        gradcam_overlay: Any = None
        rd_result: Any = None
    MODEL_DIR: str = ""
else:
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    from PIL import Image

    # Wrap heavy ML imports — server starts even if torch/model is slow or unavailable
    _ML_AVAILABLE = False
    try:
        from src.inference.infer import run_inference, InferenceResult
        from src.inference.gemini_scanner import analyze_with_gemini
        from src.core.config import MODEL_DIR
        _ML_AVAILABLE = True
        print("[OK] ML model modules loaded successfully.")
    except Exception as _ml_err:
        print(f"[WARN] ML model unavailable: {_ml_err}. Running in DEMO mode.")
        MODEL_DIR = ""
        # Provide a stub InferenceResult for demo mode
        class InferenceResult:  # type: ignore
            def __init__(self) -> None:
                self.fake_probability: float = 0.42
                self.label: str = "REAL"
                self.face_crop = None
                self.gradcam_overlay = None
                self.rd_result = None
        def run_inference(*args, **kwargs):  # type: ignore
            return InferenceResult()
        def analyze_with_gemini(*args, **kwargs): # type: ignore
            return "DEMO MODE: Gemini analysis is unavailable because dependencies (google-genai) are missing."

def safe_round(val: Any, digits: int = 2) -> float:
    """Helper to ensure type-checkers see a float return without using round() built-in."""
    try:
        # Use string formatting to avoid round() overload issues in some type checkers
        return float(f"{float(val):.{digits}f}")
    except (TypeError, ValueError, OverflowError):
        return 0.0


# ═══════════════════════════════════════════════════════════════════
# DEMO MODE — Set to True to return realistic mock data for all
# endpoints, bypassing ML inference and Gemini API calls entirely.
# This is useful for previewing the frontend UI.
# ═══════════════════════════════════════════════════════════════════
DEMO_MODE = False

app = FastAPI(title="Trinetra Local API")

# Enable CORS for Chrome Extension communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual extension ID
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    base64_data: str  # Data URL or raw base64

class AnalysisResponse(BaseModel):
    primary_verdict: str  # "FAKE" or "REAL"
    confidence_score: float
    local_label: str
    local_confidence: float
    rd_status: Optional[str] = None
    rd_score: Optional[float] = None
    forensic_summary: str
    latency_ms: float
    face_crop_base64: Optional[str] = None
    gradcam_base64: Optional[str] = None

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(request: AnalysisRequest):
    """
    The standard 'Fast Scan' endpoint. 
    
    It decodes an image, runs our local EfficientNet model, checks Reality Defender (cloud), 
    and then plays 'Judge' to decide which result is more trustworthy.
    """
    # ── DEMO MODE: A safe playground for testing the UI without burning API keys ──
    if DEMO_MODE:
        import random
        # We add a little delay so it 'feels' like real work is happening
        await asyncio.sleep(random.uniform(0.8, 2.0)) 
        
        is_fake_demo = random.random() > 0.35 
        fake_prob = random.uniform(72.0, 96.5) if is_fake_demo else random.uniform(8.0, 28.0)
        local_label = "FAKE" if is_fake_demo else "REAL"
        local_conf = fake_prob if is_fake_demo else (100.0 - fake_prob)
        
        return AnalysisResponse(
            primary_verdict="FAKE" if is_fake_demo else "REAL",
            confidence_score=safe_round(fake_prob if is_fake_demo else (100.0 - fake_prob), 2),
            local_label=local_label,
            local_confidence=safe_round(local_conf, 2),
            rd_status="SUSPICIOUS" if is_fake_demo else "AUTHENTIC",
            rd_score=safe_round(random.uniform(0.70, 0.95) if is_fake_demo else random.uniform(0.05, 0.20), 4),
            forensic_summary=(
                "DEMO MODE: This is a simulation of how the AI would describe a deepfake finding."
            ),
            latency_ms=safe_round(random.uniform(800, 3200), 2),
            face_crop_base64=None,
            gradcam_base64=None,
        )

    try:
        # 1. Decode base64 data
        header, data = request.base64_data.split(",", 1) if "," in request.base64_data else (None, request.base64_data)
        image_bytes = base64.b64decode(data)
        
        # 2. Determine file extension from MIME type in the data URL header
        ext = ".png"  # default
        if header:
            # header looks like "data:video/mp4;base64" or "data:image/png;base64"
            mime_map = {
                "video/mp4": ".mp4", "video/avi": ".avi", "video/mov": ".mov",
                "video/quicktime": ".mov", "video/x-msvideo": ".avi", "video/mkv": ".mkv",
                "image/png": ".png", "image/jpeg": ".jpg", "image/jpg": ".jpg",
                "image/bmp": ".bmp", "image/webp": ".webp",
            }
            for mime, extension in mime_map.items():
                if mime in header.lower():
                    ext = extension
                    break
        
        # 3. Save to temporary file with correct extension
        temp_dir = os.path.join(os.getcwd(), "tmp_api")
        os.makedirs(temp_dir, exist_ok=True)
        temp_filename = f"{uuid.uuid4()}{ext}"
        temp_path = os.path.join(temp_dir, temp_filename)
        
        with open(temp_path, "wb") as f:
            f.write(image_bytes)
            
        # 4. Run Inference (in thread pool to avoid blocking the event loop)
        checkpoint_path = os.path.join(MODEL_DIR, "best_model.pt")
        if not os.path.exists(checkpoint_path):
             raise HTTPException(
                 status_code=500, 
                 detail="Model checkpoint 'best_model.pt' not found in the 'model/' directory. Please ensure the weights are downloaded and placed correctly."
             )
             
        print(f"[ANALYZE] Starting inference on: {temp_filename} (ext={ext})")
        start_time = time.perf_counter()
        try:
            result: InferenceResult = await asyncio.to_thread(run_inference, temp_path, checkpoint_path)
        except Exception as inference_err:
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Inference failed: {inference_err}")
        end_time = time.perf_counter()
        print(f"[ANALYZE] Inference complete in {(end_time - start_time)*1000:.0f}ms -> {result.label}")
        
        # 5. Clean up
        try:
            os.remove(temp_path)
        except:
            pass
            
        # 5. Build basic local stats
        pct = result.fake_probability * 100
        local_label = "FAKE" if result.label == "FAKE" else "REAL"
        local_conf = pct if local_label == "FAKE" else (100 - pct)
        
        # 6. Prioritize "Most Correct" (Cloud vs Local)
        # Why: Reality Defender (RD) is a massive cloud-scale service. If it says 
        # something is FAKE with high confidence, we trust it more than our local model.
        rd = result.rd_result
        rd_status = rd.get("status") if rd else "DISABLED"
        rd_score_raw = rd.get("score") if rd else None
        rd_score = float(rd_score_raw) if rd_score_raw is not None else 0.0
        
        # If the cloud finds a smoking gun, that's our main verdict.
        if rd and rd_status in ["FAKE", "MANIPULATED", "SUSPICIOUS"] and rd_score_raw is not None:
            primary_verdict = "FAKE"
            confidence_score = rd_score * 100
            summary = f"🚨 CLOUD VERDICT: {rd_status} ({confidence_score:.1f}%). Local model reports {local_label} ({local_conf:.1f}%)."
        elif rd and rd_status == "AUTHENTIC" and rd_score_raw is not None:
            primary_verdict = "REAL"
            confidence_score = (1.0 - rd_score) * 100
            summary = f"✅ CLOUD VERDICT: AUTHENTIC. High confidence cloud analysis confirmed media is real."
        else:
            # If the cloud is offline or unsure, our local AI takes the lead.
            primary_verdict = local_label
            confidence_score = local_conf
            rd_reason = f" ({rd_status})" if rd_status and rd_status not in ["DISABLED", "None"] else ""
            summary = f"🛡️ LOCAL VERDICT: {local_label} ({local_conf:.1f}%). Cloud verification was unavailable{rd_reason}."

        # 7. Convert images to base64
        def img_to_base64(img: Any) -> str:
            if isinstance(img, np.ndarray):
                img = Image.fromarray(img)
            buffered = io.BytesIO()
            img.save(buffered, format="PNG")
            return base64.b64encode(buffered.getvalue()).decode()

        # result arrays might be None if no face was found or XAI failed
        face_b64 = img_to_base64(result.face_crop) if result.face_crop is not None else None
        grad_b64 = img_to_base64(result.gradcam_overlay) if result.gradcam_overlay is not None else None

        return AnalysisResponse(
            primary_verdict=str(primary_verdict),
            confidence_score=safe_round(confidence_score, 2),
            local_label=str(local_label),
            local_confidence=safe_round(local_conf, 2),
            rd_status=str(rd_status) if rd_status else None,
            rd_score=safe_round(rd_score, 4) if rd_score is not None else None,
            forensic_summary=str(summary),
            latency_ms=safe_round((end_time - start_time) * 1000, 2),
            face_crop_base64=face_b64,
            gradcam_base64=grad_b64
        )
        
    except HTTPException:
        # Re-raise FastAPI HTTP exceptions directly (don't double-wrap)
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"[API Error] Unexpected: {e}")
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")

class SubscriptionRequest(BaseModel):
    email: str

@app.post("/subscribe")
async def subscribe(request: SubscriptionRequest):
    # Simulate sending an email
    print(f"[EMAIL] Sending Newsletter Welcome Email to: {request.email}")
    await asyncio.sleep(1) # Non-blocking delay
    return {"status": "success", "message": f"[SIMULATION] Welcome email queued for {request.email}. (Note: Real SMTP is disabled in this local build)"}

@app.get("/health")
async def health_check():
    return {"status": "online", "model": "EfficientNet-V2-S"}

class AdvanceScanRequest(BaseModel):
    base64_data: str

class AdvanceScanResponse(BaseModel):
    analysis: str

@app.post("/advance-scan", response_model=AdvanceScanResponse)
async def advance_scan(request: AdvanceScanRequest):
    """
    The 'Super Expert' endpoint. 
    
    This doesn't just give a 'Yes/No'. It sends the image to Google's Gemini (Gemma-4)
    along with a massive forensic manual to perform a human-like investigation.
    """
    # ── DEMO MODE: return a realistic Gemini-style forensic report ──
    if DEMO_MODE:
        import random
        await asyncio.sleep(random.uniform(2.0, 5.0))  # simulate Gemini latency
        demo_analysis = """**Verdict:**
Manipulated

**Confidence:**
87

**Why this verdict is strongest:**

1. **Facial boundary artifacts:** There is a visible edge halo around the jawline and hairline on the left side of the face, consistent with a face-swap blending boundary. The transition from facial skin to neck skin shows an abrupt change in texture granularity.
2. **Inconsistent subsurface scattering:** The left ear displays noticeably different translucency compared to the right ear. In a real photograph under this lighting, both ears should exhibit similar subsurface light transmission.
3. **Iris specular anomaly:** The specular highlights in the left eye appear to originate from a different light source direction than those in the right eye, suggesting the face region was composited from a different source image.
4. **Skin texture discontinuity:** The forehead region (above the brow line) shows synthetic over-smoothing with a waxy sheen, while the cheeks retain natural pore-level detail — a hallmark of partial face replacement.
5. **Compression artifact mismatch:** The JPEG compression pattern around the face boundary differs from the background, indicating region-specific re-encoding.

**What argues against it:**

- Overall composition is highly convincing at first glance
- Lighting direction is globally consistent (single overhead source)
- Hair strand detail is remarkably natural, especially baby hairs at the temple
- Body proportions and clothing interaction appear physically plausible
- Background elements show no signs of warping or deformation

**Most suspicious regions:**

- **Left jawline boundary:** Edge halo and blending seam (3-4px wide)
- **Forehead above brow line:** Synthetic smoothing, loss of pore detail
- **Left ear:** Abnormal translucency / subsurface scattering mismatch
- **Both irises:** Conflicting specular highlight angles
- **Neck-face junction:** Abrupt texture granularity shift

**Alternative explanations:**

A heavy beauty filter (e.g., FaceApp, Snow, or similar) could explain the forehead smoothing. However, beauty filters typically apply uniformly across the face and do not create the localized boundary artifacts observed at the jawline. The specular highlight inconsistency in the irises is not explained by any standard filter or lens effect.

**Failure risk:**

A state-of-the-art face-swap model (e.g., latest FaceFusion or roop-unleashed) with careful post-processing, manual color grading, and re-compression could potentially reduce the boundary artifacts to near-imperceptible levels. The specular highlight mismatch would require per-eye relighting in post-production to fully resolve, which is within the capability of a skilled adversary."""
        return AdvanceScanResponse(analysis=demo_analysis)

    temp_path: str | None = None
    try:
        # Decode base64 data
        header, data = request.base64_data.split(",", 1) if "," in request.base64_data else (None, request.base64_data)
        image_bytes = base64.b64decode(data)
        
        ext = ".png"
        if header:
            mime_map = {
                "image/png": ".png", "image/jpeg": ".jpg", "image/jpg": ".jpg",
                "image/bmp": ".bmp", "image/webp": ".webp",
            }
            for mime, extension in mime_map.items():
                if mime in header.lower():
                    ext = extension
                    break
                    
        temp_dir = os.path.join(os.getcwd(), "tmp_api")
        os.makedirs(temp_dir, exist_ok=True)
        temp_filename = f"gemini_{uuid.uuid4()}{ext}"
        temp_path = os.path.join(temp_dir, temp_filename)
        
        with open(temp_path, "wb") as f:
            f.write(image_bytes)
            
        print(f"[ADVANCE-SCAN] Sending to Gemini: {temp_filename} ({len(image_bytes)//1024}KB)")
        
        # Run Gemini API call in a thread to not block event loop
        analysis_text = await asyncio.to_thread(analyze_with_gemini, temp_path)
        
        return AdvanceScanResponse(analysis=analysis_text)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        err_str = str(e).lower()
        # Provide user-friendly error messages
        if "exhausted" in err_str or "429" in err_str or "quota" in err_str:
            detail = "All API keys are rate-limited. Please wait a minute and try again."
        elif "500" in err_str or "internal" in err_str or "unavailable" in err_str:
            detail = "Google's AI servers are temporarily overloaded. Please try again in a few seconds."
        else:
            detail = f"Advanced scan failed: {e}"
        print(f"[ADVANCE-SCAN Error]: {detail}")
        raise HTTPException(status_code=500, detail=detail)
    finally:
        # Always clean up temp file
        if temp_path:
            try:
                os.remove(temp_path)
            except OSError:
                pass


if __name__ == "__main__":
    import uvicorn # type: ignore
    uvicorn.run(app, host="127.0.0.1", port=8000)
