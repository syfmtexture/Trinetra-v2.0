import torch
import os
import time

def test_load():
    ckpt_path = "a:/KODES/Trinetra-18-3/Trinetra/backend/model/best_model.pt"
    if not os.path.exists(ckpt_path):
        print("Model not found")
        return
    
    print(f"Loading {ckpt_path}...")
    start = time.time()
    try:
        # Load on CPU first to be safe
        ckpt = torch.load(ckpt_path, map_location="cpu", weights_only=False)
        print(f"Loaded successfully in {time.time() - start:.2f}s")
        print(f"Keys: {list(ckpt.keys())[:5]}...")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_load()
