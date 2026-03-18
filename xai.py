"""
xai.py — Explainable AI Analysis Modules for Project Trinetra.

Three post-inference forensic tools that run SEQUENTIALLY after the
primary EfficientNet-B4 + LSTM forward pass to stay within 8 GB VRAM.

Modules
───────
1. temporal_attention_rollout  — LSTM hidden-state confidence per frame
2. noise_residual_extraction   — Error Level Analysis noise map
3. geometric_jitter_mapping    — Landmark micro-movement variance
"""

import io
from typing import Optional

import cv2
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image


# ──────────────────────────────────────────────
#  1. Temporal Attention Rollout
# ──────────────────────────────────────────────

def temporal_attention_rollout(
    lstm_hidden_states: torch.Tensor,
    fc_seq: torch.nn.Linear,
) -> dict:
    """
    Decode per-timestep manipulation confidence from LSTM hidden states.

    Parameters
    ----------
    lstm_hidden_states : (T, hidden_dim)  — squeezed from batch dim
    fc_seq             : the model's sequence classification head (Linear → 1)

    Returns
    -------
    dict with keys:
        per_frame_confidence : list[float]  — sigmoid probability per frame (%)
        shatter_index        : int          — frame index of max inter-frame delta
        shatter_delta        : float        — magnitude of the largest confidence jump
    """
    with torch.no_grad():
        # fc_seq expects (N, hidden) → (N, 1)
        logits = fc_seq(lstm_hidden_states)           # (T, 1)
        probs = torch.sigmoid(logits).squeeze(-1)     # (T,)
        confidences = (probs * 100).cpu().tolist()     # percentages

    # Identify the shatter point — largest absolute delta between consecutive frames
    confidences_arr = np.array(confidences)
    if len(confidences_arr) > 1:
        deltas = np.abs(np.diff(confidences_arr))
        shatter_idx = int(np.argmax(deltas)) + 1      # frame AFTER the jump
        shatter_delta = round(float(deltas.max()), 2)
    else:
        shatter_idx = 0
        shatter_delta = 0.0

    return {
        "per_frame_confidence": [round(c, 2) for c in confidences],
        "shatter_index": shatter_idx,
        "shatter_delta": shatter_delta,
    }


# ──────────────────────────────────────────────
#  2. Noise Residual Extraction (Error Level Analysis)
# ──────────────────────────────────────────────

def noise_residual_extraction(
    face_rgb: np.ndarray,
    jpeg_quality: int = 90,
    amplification: int = 15,
) -> np.ndarray:
    """
    Reveal hidden compression artifacts via Error Level Analysis.

    The face crop is re-compressed to JPEG at `jpeg_quality`, and the
    absolute pixel-wise difference is amplified to expose blending scars,
    unnatural smoothing, and stitching boundaries.

    Parameters
    ----------
    face_rgb      : (H, W, 3) uint8 RGB
    jpeg_quality  : JPEG re-compression quality (lower = more aggressive)
    amplification : scalar multiplier for the residual signal

    Returns
    -------
    residual : (H, W, 3) uint8 RGB — amplified noise matrix
    """
    # Convert to BGR for OpenCV JPEG codec
    bgr = cv2.cvtColor(face_rgb, cv2.COLOR_RGB2BGR)

    # Re-compress in-memory
    encode_params = [cv2.IMWRITE_JPEG_QUALITY, jpeg_quality]
    _, encoded = cv2.imencode(".jpg", bgr, encode_params)
    recompressed = cv2.imdecode(encoded, cv2.IMREAD_COLOR)

    # Compute absolute difference and amplify
    diff = cv2.absdiff(bgr, recompressed).astype(np.float32)
    amplified = np.clip(diff * amplification, 0, 255).astype(np.uint8)

    # Convert back to RGB
    residual = cv2.cvtColor(amplified, cv2.COLOR_BGR2RGB)
    return residual


# ──────────────────────────────────────────────
#  3. Geometric Jitter Mapping
# ──────────────────────────────────────────────

def geometric_jitter_mapping(
    landmarks_sequence: list[np.ndarray],
) -> dict:
    """
    Quantify facial geometry stability across a video sequence.

    Uses the 5-point MTCNN landmarks (left_eye, right_eye, nose,
    mouth_left, mouth_right) to measure micro-movements.  Landmarks
    are normalised by inter-ocular distance per frame to remove
    scale / translation drift before computing variance.

    Parameters
    ----------
    landmarks_sequence : list of (5, 2) np arrays — one per frame

    Returns
    -------
    dict with keys:
        per_landmark_variance : dict[str, float]  — variance per point
        jitter_score          : float              — aggregate instability metric
        frame_count           : int                — number of valid frames used
    """
    LANDMARK_NAMES = [
        "left_eye", "right_eye", "nose", "mouth_left", "mouth_right"
    ]

    if not landmarks_sequence or len(landmarks_sequence) < 2:
        return {
            "per_landmark_variance": {n: 0.0 for n in LANDMARK_NAMES},
            "jitter_score": 0.0,
            "frame_count": len(landmarks_sequence) if landmarks_sequence else 0,
        }

    # Normalise each frame's landmarks by inter-ocular distance
    normalised = []
    for lm in landmarks_sequence:
        lm = np.array(lm, dtype=np.float64)          # (5, 2)
        left_eye, right_eye = lm[0], lm[1]
        iod = np.linalg.norm(right_eye - left_eye)   # inter-ocular distance
        if iod < 1e-6:
            continue  # degenerate detection, skip
        # Translate so midpoint of eyes is origin, scale by IOD
        midpoint = (left_eye + right_eye) / 2.0
        normed = (lm - midpoint) / iod
        normalised.append(normed)

    if len(normalised) < 2:
        return {
            "per_landmark_variance": {n: 0.0 for n in LANDMARK_NAMES},
            "jitter_score": 0.0,
            "frame_count": len(normalised),
        }

    stacked = np.stack(normalised)  # (N, 5, 2)

    # Per-landmark variance = mean of x-var + y-var across frames
    per_lm_var = {}
    for i, name in enumerate(LANDMARK_NAMES):
        x_var = float(np.var(stacked[:, i, 0]))
        y_var = float(np.var(stacked[:, i, 1]))
        per_lm_var[name] = round((x_var + y_var) * 1e4, 4)  # scale ×10⁴ for readability

    jitter_score = round(float(np.mean(list(per_lm_var.values()))), 4)

    return {
        "per_landmark_variance": per_lm_var,
        "jitter_score": jitter_score,
        "frame_count": len(normalised),
    }
