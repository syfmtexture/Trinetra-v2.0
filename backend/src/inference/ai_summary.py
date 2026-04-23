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
    Translates raw numbers and technical jargon into a simple, 2-sentence human summary.
    
    Why this exists:
    Most users don't care about 'EfficientNet weights' or 'subsurface scattering'. 
    They just want to know: "Is it fake?" and "What should I do?".
    This function uses Groq (Llama 3) to act as the 'translator'.
    
    Process:
    1. Grabs the technical findings from our local AI (EfficientNet).
    2. Grabs the cloud findings (Reality Defender).
    3. Feeds both to Llama 3 with instructions to be short, direct, and actionable.
    """
    if not GROQ_API:
        logger.warning("Oops! GROQ_API key is missing. We'll have to skip the AI summary for now.")
        return ""

    try:
        from groq import Groq

        # Initialize the Groq client — this is our bridge to the Llama model
        client = Groq(api_key=GROQ_API)

        # ── Data Preparation ──
        # We extract the 'juice' from the complex inference_result object
        local_label = inference_result.label
        local_prob = inference_result.fake_probability * 100

        rd = inference_result.rd_result
        rd_text = "unavailable"
        if rd:
            rd_status = rd.get("status", "N/A")
            rd_score = rd.get("score", 0) * 100
            rd_text = f"Status: {rd_status}, Score: {rd_score:.1f}%"

        # ── The Prompt ──
        # This is where we tell the AI how to behave. 
        # We want it to be 'Trinetra'—the smart, direct forensic expert.
        system_prompt = (
            "You are Trinetra, a professional forensic AI. Your goal is to explain "
            "technical deepfake results to a regular person. "
            "Rule: Sentence 1 states the verdict clearly. Sentence 2 gives a safety tip. "
            "No jargon. No fluff. Be extremely direct."
        )

        user_prompt = (
            f"Here are the technical results:\n"
            f"- Our Local AI says: {local_label} ({local_prob:.1f}% probability)\n"
            f"- Cloud Verification says: {rd_text}"
        )

        # ── Generation ──
        # We use a low temperature (0.3) because we want facts, not creative writing.
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
        logger.error(f"Something went wrong while generating the AI summary: {e}")
        return ""
