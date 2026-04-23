import base64
import requests
import os

def test_analyze():
    url = "http://127.0.0.1:8000/analyze"
    img_path = "a:/KODES/Trinetra-18-3/Trinetra/backend/test_dummy.png"
    
    if not os.path.exists(img_path):
        print(f"Error: {img_path} not found")
        return

    with open(img_path, "rb") as f:
        img_base64 = base64.b64encode(f.read()).decode()

    payload = {
        "base64_data": f"data:image/png;base64,{img_base64}"
    }

    print(f"Sending request to {url}...")
    try:
        response = requests.post(url, json=payload, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_analyze()
