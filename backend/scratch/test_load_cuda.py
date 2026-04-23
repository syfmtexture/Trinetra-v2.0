import torch
import os
import time

def test_load_cuda():
    ckpt_path = "a:/KODES/Trinetra-18-3/Trinetra/backend/model/best_model.pt"
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")
    
    print(f"Loading {ckpt_path} on {device}...")
    start = time.time()
    try:
        ckpt = torch.load(ckpt_path, map_location=device, weights_only=False)
        print(f"Loaded successfully in {time.time() - start:.2f}s")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_load_cuda()
