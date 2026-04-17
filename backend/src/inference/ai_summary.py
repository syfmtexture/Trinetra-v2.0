"""
ai_summary.py — AI-powered forensic summary using Groq (Llama 3.3 70B).

Takes an InferenceResult and generates a natural-language verdict + guidance.
"""

import os
import logging
from dotenv import load_dotenv

load_dotenv()

GROQ_API = os.getenv("GROQ_API")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

logger = logging.getLogger("Trinetra.AISummary")


def generate_ai_summary(inference_result) -> str:
    """
    Generate a natural language summary and guidance using Groq.

    Parameters
    ----------
    inference_result : InferenceResult from infer.py

    Returns
    -------
    str — 3-4 sentence summary with verdict + guidance, or "" on failure.
    """
    if not GROQ_API:
        logger.warning("GROQ_API not configured. Skipping AI summary.")
        return ""

    try:
        from groq import Groq

        client = Groq(api_key=GROQ_API)

        local_label = inference_result.label
        local_prob = inference_result.fake_probability * 100

        rd = inference_result.rd_result
        rd_text = "N/A (disabled or offline)"
        if rd:
            rd_status = rd.get("status", "N/A")
            rd_score = rd.get("score", 0) * 100
            rd_text = f"Status: {rd_status}, Score: {rd_score:.1f}%"

        latency = inference_result.forensic_log.get("inference_latency_ms", "N/A")

        system_prompt = (
            "You are Trinetra, a forensic AI. Give a 2-sentence verdict: "
            "first sentence states if media is real/fake and why, "
            "second sentence gives one actionable recommendation. Be direct. No fluff."
        )

        user_prompt = (
            f"Local AI: {local_label} ({local_prob:.1f}%), "
            f"Cloud: {rd_text}"
        )

        completion = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=120,
            top_p=1,
            stream=False,
        )

        return completion.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"Error generating AI summary: {e}")
        return ""
