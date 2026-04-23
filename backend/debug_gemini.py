import traceback
from src.inference.gemini_scanner import analyze_with_gemini
import os
import numpy as np
from PIL import Image

def main():
    p = 'test_dummy.png'
    Image.fromarray(np.random.randint(0,255,(224,224,3),dtype=np.uint8)).save(p)
    try:
        print(analyze_with_gemini(p))
    except Exception as e:
        traceback.print_exc()

if __name__ == '__main__':
    main()
