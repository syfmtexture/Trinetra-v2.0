import os
import sys
import torch
import numpy as np
from PIL import Image

# Setup paths
_backend_dir = os.path.dirname(os.path.abspath(__file__))
if _backend_dir not in sys.path:
    sys.path.append(_backend_dir)

from src.inference.infer import run_inference

def main():
    checkpoint_path = os.path.join("model", "best_model.pt")
    
    # Create a dummy image
    dummy_img_path = "debug_test.jpg"
    dummy_img = Image.fromarray(np.random.randint(0, 255, (384, 384, 3), dtype=np.uint8))
    dummy_img.save(dummy_img_path)
    
    print(f"Testing inference with {checkpoint_path}...")
    try:
        result = run_inference(dummy_img_path, checkpoint_path)
        print(f"SUCCESS! Label: {result.label}, Prob: {result.fake_probability}")
    except Exception:
        import traceback
        traceback.print_exc()
    finally:
        if os.path.exists(dummy_img_path):
            os.remove(dummy_img_path)

if __name__ == "__main__":
    main()
