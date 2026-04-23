import os
import sys
import time

# Add src to path
sys.path.append(os.getcwd())

from src.inference.infer import run_inference

def test_inference():
    img_path = "test_dummy.png"
    ckpt_path = "model/best_model.pt"
    
    print(f"Running inference on {img_path}...")
    start = time.time()
    try:
        result = run_inference(img_path, ckpt_path)
        print(f"Inference complete in {time.time() - start:.2f}s")
        print(f"Label: {result.label}, Prob: {result.fake_probability}")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error: {e}")

if __name__ == "__main__":
    test_inference()
