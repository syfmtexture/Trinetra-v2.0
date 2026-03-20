import os
import logging
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
GROQ_API = os.getenv("GROQ_API")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

# Logging
logger = logging.getLogger("Trinetra.AISummary")

def generate_ai_summary(inference_result) -> str:
    """
    Generates a natural language summary and guidance using Groq Llama 3.1 8B.
    
    Parameters:
    - inference_result: The InferenceResult dataclass from infer.py
    
    Returns:
    - A 3-4 sentence string with the summary and guidance.
    """
    if not GROQ_API or GROQ_API.startswith("gsk_your_key"):
        logger.warning("GROQ_API not configured. Skipping AI summary.")
        return ""

    try:
        client = Groq(api_key=GROQ_API)
        
        # Construct the context prompt
        local_label = inference_result.label
        local_prob = inference_result.fake_probability * 100
        
        rd = inference_result.rd_result
        rd_text = "N/A"
        if rd:
            rd_status = rd.get("status", "N/A")
            rd_score = rd.get("score", 0) * 100
            rd_text = f"Status: {rd_status}, Score: {rd_score:.1f}%"
            
        system_prompt = (
            "You are Trinetra, an expert forensic AI analyst. Your goal is to provide a concise, "
            "direct, and actionable summary of deepfake detection results. Use a professional yet accessible tone."
        )
        
        user_prompt = (
            f"Please summarize the following forensic analysis results in 3-4 sentences. "
            f"Explain the verdict and provide clear guidance on whether to trust this media.\n\n"
            f"RESULTS:\n"
            f"- Local AI Detection: {local_label} ({local_prob:.1f}% manipulation probability)\n"
            f"- Cloud (Reality Defender): {rd_text}\n"
            f"- Forensic Latency: {inference_result.forensic_log.get('inference_latency_ms')}ms\n"
        )
        
        completion = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.5,
            max_tokens=256,
            top_p=1,
            stream=False,
            stop=None,
        )
        
        summary = completion.choices[0].message.content.strip()
        return summary

    except Exception as e:
        logger.error(f"Error generating AI summary: {e}")
        return ""
