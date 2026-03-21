"""
api.py — FastAPI Backend for Trinetra Chrome Extension.

Provides a REST endpoint for the extension to send cropped image regions
for deepfake analysis using the local hybrid model.
"""

import os
import uuid
import base64
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io

from src.inference.infer import run_inference, InferenceResult
from src.core.config import MODEL_DIR

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
    rd_status: str | None = None
    rd_score: float | None = None
    forensic_summary: str
    latency_ms: float
    face_crop_base64: str | None = None
    gradcam_base64: str | None = None

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(request: AnalysisRequest):
    try:
        # 1. Decode base64 data
        header, data = request.base64_data.split(",", 1) if "," in request.base64_data else (None, request.base64_data)
        image_bytes = base64.b64decode(data)
        
        # 2. Save to temporary file
        temp_dir = os.path.join(os.getcwd(), "tmp_api")
        os.makedirs(temp_dir, exist_ok=True)
        temp_filename = f"{uuid.uuid4()}.png"
        temp_path = os.path.join(temp_dir, temp_filename)
        
        with open(temp_path, "wb") as f:
            f.write(image_bytes)
            
        # 3. Run Inference
        checkpoint_path = os.path.join(MODEL_DIR, "best_model.pt")
        if not os.path.exists(checkpoint_path):
             raise HTTPException(status_code=500, detail="Model checkpoint not found.")
             
        start_time = time.perf_counter()
        result: InferenceResult = run_inference(temp_path, checkpoint_path)
        end_time = time.perf_counter()
        
        # 4. Clean up
        try:
            os.remove(temp_path)
        except:
            pass
            
        # 5. Build basic local stats
        pct = result.fake_probability * 100
        local_label = "FAKE" if result.label == "FAKE" else "REAL"
        local_conf = pct if local_label == "FAKE" else (100 - pct)
        
        # 6. Prioritize "Most Correct" (Cloud > Local)
        # As local model is not fully trained, RD Cloud is the primary authority.
        rd = result.rd_result
        rd_status = rd.get("status") if rd else "DISABLED"
        rd_score = rd.get("score", 0.0) if rd else 0.0
        
        # Logic: If RD found it FAKE/MANIPULATED, that's our primary verdict.
        if rd and rd_status in ["FAKE", "MANIPULATED", "SUSPICIOUS"]:
            primary_verdict = "FAKE"
            confidence_score = rd_score * 100
            summary = f"🚨 CLOUD VERDICT: {rd_status} ({confidence_score:.1f}%). Local model reports {local_label} ({local_conf:.1f}%)."
        elif rd and rd_status == "AUTHENTIC":
            primary_verdict = "REAL"
            confidence_score = (1.0 - rd_score) * 100
            summary = f"✅ CLOUD VERDICT: AUTHENTIC. High confidence cloud analysis confirmed media is real."
        else:
            # Fallback to local if RD is offline or inconclusive
            primary_verdict = local_label
            confidence_score = local_conf
            summary = f"🛡️ LOCAL VERDICT: {local_label} ({local_conf:.1f}%). Cloud verification was inconclusive or offline."

        # 7. Convert images to base64
        def pil_to_base64(img: Image.Image) -> str:
            buffered = io.BytesIO()
            img.save(buffered, format="PNG")
            return base64.b64encode(buffered.getvalue()).decode()

        face_b64 = pil_to_base64(result.face_crop) if result.face_crop else None
        grad_b64 = pil_to_base64(result.gradcam_overlay) if result.gradcam_overlay else None

        return AnalysisResponse(
            primary_verdict=primary_verdict,
            confidence_score=round(confidence_score, 2),
            local_label=local_label,
            local_confidence=round(local_conf, 2),
            rd_status=rd_status,
            rd_score=round(rd_score, 4) if rd else None,
            forensic_summary=summary,
            latency_ms=round((end_time - start_time) * 1000, 2),
            face_crop_base64=face_b64,
            gradcam_base64=grad_b64
        )
        
    except Exception as e:
        print(f"API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "online", "model": "EfficientNet-B4 + LSTM"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
