import os
from PIL import Image
from google import genai
import random

# User provided API keys
API_KEYS = [
    "AIzaSyBQqMO1oQZqTguiZ3vNGqCPj71pZK9g2OE",
    "AIzaSyAmqnzWH8frfecanBtlOqkYsAGgBz-Puhw",
    "AIzaSyDvghydnoTZsuM4TFfeONVwWj6Cd3uKwlc"
]

# Forensic prompt
SYSTEM_PROMPT = """> **Advanced forensic image authenticity analysis (high-scrutiny mode):**
> Perform a **multi-layer forensic evaluation** to determine whether this image is real, AI-generated, or manipulated. Assume the image may be produced by **state-of-the-art generative models designed to evade detection**.
>
> Conduct analysis across the following dimensions:
>
> **1. Anatomical & structural consistency**
> Examine face, skull proportions, eyes, pupils, eyelids, ears, teeth, hands, fingers, joints, posture, and body mechanics for subtle asymmetries, impossible geometry, or statistically unlikely proportions.
>
> **2. Physical realism & lighting coherence**
> Verify whether lighting obeys real-world physics:
>
> * Direction, intensity, and color consistency
> * Shadow geometry and softness
> * Reflections and refractions (mirrors, eyes, glass, water)
> * Subsurface scattering (skin, ears, fingers under light)
>
> **3. Texture & frequency analysis (critical for advanced AI)**
> Inspect at micro-level:
>
> * Skin pores vs synthetic smoothness
> * Hair strand continuity vs clumping
> * Fabric weave realism
> * Repeating or procedurally generated patterns
> * Frequency inconsistencies (over-smoothing vs artificial sharpness)
>
> **4. Spatial & perspective integrity**
> Check:
>
> * Depth consistency across objects
> * Perspective alignment
> * Background-object relationship
> * Scale realism
>
> **5. Local artifact detection**
> Identify subtle issues such as:
>
> * Edge halos or blending seams
> * Warping or bending in straight lines
> * Inconsistent blur (depth of field errors)
> * Region-specific resolution mismatch
>
> **6. Semantic coherence**
> Look for logically inconsistent details:
>
> * Objects that don’t function correctly
> * Accessories merging into body/clothing
> * Text or symbols that are malformed or nonsensical
>
> **7. AI-specific high-level signals**
> Consider modern generation traits:
>
> * Overly “perfect” composition or symmetry
> * Hyper-aesthetic or stylized realism
> * Lack of natural imperfections
> * Global coherence but weak local fidelity
>
> **Instructions:**
>
> * Do not rely on metadata.
> * Assume adversarial quality (designed to pass as real).
> * Avoid overconfidence—false positives are possible.
>
> **Output format:**
>
> 1. Verdict: real / AI-generated / manipulated / inconclusive
> 2. Confidence score (0–100)
> 3. Strongest evidence supporting the verdict
> 4. Evidence contradicting the verdict
> 5. Most suspicious regions (describe precisely)
> 6. Failure risk: explain how this could fool detection"""

class GeminiKeyManager:
    def __init__(self, keys):
        self.keys = keys
        self.current_idx = 0
    
    def get_key(self):
        # We can round robin or randomize to distribute load
        key = self.keys[self.current_idx]
        self.current_idx = (self.current_idx + 1) % len(self.keys)
        return key

key_manager = GeminiKeyManager(API_KEYS)

def analyze_with_gemini(image_path: str) -> str:
    """
    Sends the image and the forensic prompt to Gemma via Gemini API.
    Handles API key rotation if quota is exceeded.
    """
    img = Image.open(image_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
        
    attempts = 0
    max_attempts = len(API_KEYS)
    
    last_error = None
    
    while attempts < max_attempts:
        current_key = key_manager.get_key()
        try:
            client = genai.Client(api_key=current_key)
            
            response = client.models.generate_content(
                model='gemma-4-31b-it',
                contents=[img, SYSTEM_PROMPT]
            )
            
            return response.text
            
        except Exception as e:
            last_error = e
            error_msg = str(e).lower()
            if "429" in error_msg or "quota" in error_msg or "exhausted" in error_msg:
                print(f"[GEMINI] Key hit rate limit, rotating... ({attempts+1}/{max_attempts})")
                attempts += 1
                continue
            else:
                # Other errors like 400 Bad Request or network error, do not rotate blindly
                raise RuntimeError(f"Gemini API Error: {e}")
                
    raise RuntimeError(f"All Gemini API keys exhausted or failed. Last error: {last_error}")
