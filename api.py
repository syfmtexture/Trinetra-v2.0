"""
api.py — FastAPI Backend for Trinetra Chrome Extension.

Provides a REST endpoint for the extension to send cropped image regions
for deepfake analysis using the local hybrid model.
"""

import os
import uuid
import base64
import time
import httpx
from fastapi import FastAPI, HTTPException, Form, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io

from src.inference.infer import run_inference, InferenceResult, analyze_audio
from src.core.config import MODEL_DIR, AUDIO_EXTENSIONS

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
             
        start_time = float(time.perf_counter())
        result: InferenceResult = run_inference(temp_path, checkpoint_path)
        end_time = float(time.perf_counter())
        latency = float(end_time - start_time)
        
        # 4. Clean up
        try:
            os.remove(temp_path)
        except:
            pass
            
        # 5. Build basic local stats
        pct = float(result.fake_probability * 100)
        local_label = "FAKE" if result.label == "FAKE" else "REAL"
        local_conf = pct if local_label == "FAKE" else (100.0 - pct)
        
        # 6. Prioritize "Most Correct" (Cloud > Local)
        # As local model is not fully trained, RD Cloud is the primary authority.
        rd = result.rd_result
        rd_status = rd.get("status") if rd else "DISABLED"
        rd_score = float(rd.get("score", 0.0)) if rd else 0.0
        
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

        return AnalysisResponse(
            primary_verdict=primary_verdict,
            confidence_score=round(float(confidence_score), 2),
            local_label=local_label,
            local_confidence=round(float(local_conf), 2),
            rd_status=rd_status,
            rd_score=round(float(rd_score), 4) if rd else None,
            forensic_summary=summary,
            latency_ms=round(float(latency * 1000), 2)
        )
        
    except Exception as e:
        print(f"API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-audio", response_model=AnalysisResponse)
async def analyze_audio_endpoint(request: AnalysisRequest):
    try:
        # 1. Decode base64 data
        header, data = request.base64_data.split(",", 1) if "," in request.base64_data else (None, request.base64_data)
        audio_bytes = base64.b64decode(data)
        
        # 2. Save to temporary file
        temp_dir = os.path.join(os.getcwd(), "tmp_api")
        os.makedirs(temp_dir, exist_ok=True)
        # We try to guess extension from header if possible, else default to .mp3
        ext = ".mp3"
        if header and "wav" in header: ext = ".wav"
        elif header and "m4a" in header: ext = ".m4a"
        
        temp_filename = f"{uuid.uuid4()}{ext}"
        temp_path = os.path.join(temp_dir, temp_filename)
        
        with open(temp_path, "wb") as f:
            f.write(audio_bytes)
            
        # 3. Run Audio Inference (RD-only)
        start_time = float(time.perf_counter())
        result: InferenceResult = analyze_audio(temp_path)
        end_time = float(time.perf_counter())
        latency = float(end_time - start_time)
        
        # 4. Clean up
        try: os.remove(temp_path)
        except: pass
            
        rd = result.rd_result
        rd_status = rd.get("status") if rd else "DISABLED"
        rd_score = float(rd.get("score", 0.0)) if rd else 0.0
        
        # Build summary
        if rd and rd_status in ["FAKE", "MANIPULATED", "SUSPICIOUS"]:
            summary = f"🚨 CLOUD VERDICT: {rd_status} ({(rd_score*100):.1f}%). Audio appears to be AI-generated."
        elif rd and rd_status == "AUTHENTIC":
            summary = f"✅ CLOUD VERDICT: AUTHENTIC. High confidence cloud analysis confirmed audio is real."
        else:
            summary = f"⚠️ CLOUD VERDICT: {rd_status}. Cloud analysis was inconclusive."

        return AnalysisResponse(
            primary_verdict=result.label,
            confidence_score=round(float(result.fake_probability * 100), 2),
            local_label="N/A",
            local_confidence=0.0,
            rd_status=rd_status,
            rd_score=round(float(rd_score), 4) if rd else None,
            forensic_summary=summary,
            latency_ms=round(float(latency * 1000), 2)
        )
    except Exception as e:
        print(f"Audio API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/whatsapp")
async def whatsapp_webhook(request: Request):
    """
    Twilio WhatsApp Webhook.
    Receives media, runs inference, and replies with TwiML.
    """
    form_data = await request.form()
    MediaUrl0 = form_data.get("MediaUrl0")
    From = form_data.get("From")
    Body = form_data.get("Body")

    print(f"DEBUG: WhatsApp Webhook received from {From}. MediaUrl0: {MediaUrl0}")

    if not MediaUrl0:
        return Response(
            content=f'<?xml version="1.0" encoding="UTF-8"?><Response><Message>👋 Welcome to Trinetra. Please send an image or video to begin forensic analysis.</Message></Response>',
            media_type="application/xml"
        )

    try:
        # 1. Setup temp dir
        temp_dir = os.path.join(os.getcwd(), "tmp_api")
        os.makedirs(temp_dir, exist_ok=True)

        # 2. Download Media
        async with httpx.AsyncClient() as client:
            resp = await client.get(MediaUrl0)
            if resp.status_code != 200:
                raise Exception("Failed to download media from Twilio.")
            
            # Determine extension from Content-Type
            ctype = resp.headers.get("Content-Type", "").lower()
            is_audio = "audio" in ctype
            if "image" in ctype:
                ext = ".png"
            elif "video" in ctype:
                ext = ".mp4"
            elif is_audio:
                ext = ".mp3" # default audio
            else:
                # Fallback to URL extension
                ext = os.path.splitext(MediaUrl0.split('?')[0])[1].lower() or ".png"
                if ext in AUDIO_EXTENSIONS: is_audio = True
                
            temp_filename = f"whatsapp_{uuid.uuid4()}{ext}"
            temp_path = os.path.join(temp_dir, temp_filename)
            
            with open(temp_path, "wb") as f:
                f.write(resp.content)

        # 3. Run Inference
        start_time = time.perf_counter()
        if is_audio:
            result: InferenceResult = analyze_audio(temp_path)
        else:
            checkpoint_path = os.path.join(MODEL_DIR, "best_model.pt")
            result: InferenceResult = run_inference(temp_path, checkpoint_path)
        end_time = time.perf_counter()
        latency = round((end_time - start_time) * 1000, 2)

        # 4. Clean up
        try: os.remove(temp_path)
        except: pass

        # 5. Build Human Readable Reply
        is_fake = result.label == "FAKE"
        emoji = "🚨" if is_fake else "✅"
        pct = result.fake_probability * 100
        conf = pct if is_fake else (100 - pct)
        
        rd = result.rd_result
        rd_text = ""
        if rd and rd.get("status") != "DISABLED":
            rd_text = f"\n🛡️ RD Cloud: {rd.get('status')} ({(rd.get('score', 0)*100):.1f}%)"

        reply = (
            f"*{emoji} TRINETRA FORENSIC VERDICT*\n\n"
            f"Result: *{result.label}*\n"
            f"Confidence: {conf:.1f}%\n"
            f"{rd_text}\n\n"
            f"Processing Latency: {latency}ms\n"
            f"_{"Reality Defender Cloud Scan" if is_audio else "EfficientNet-B4 + LSTM"}_"
        )

        return Response(
            content=f'<?xml version="1.0" encoding="UTF-8"?><Response><Message>{reply}</Message></Response>',
            media_type="application/xml"
        )

    except Exception as e:
        print(f"WhatsApp API Error: {e}")
        error_msg = "⚠️ Forensic analysis failed. Please ensure you sent a valid image or video."
        return Response(
            content=f'<?xml version="1.0" encoding="UTF-8"?><Response><Message>{error_msg}</Message></Response>',
            media_type="application/xml"
        )

@app.get("/health")
async def health_check():
    return {"status": "online", "model": "EfficientNet-B4 + LSTM"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
