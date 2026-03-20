import requests

def test_whatsapp_webhook():
    url = "http://localhost:8001/whatsapp"
    # Using a dummy image URL for testing
    data = {
        "MediaUrl0": "https://raw.githubusercontent.com/python-pillow/Pillow/master/src/Pillow.png",
        "Body": "Check this out",
        "From": "whatsapp:+1234567890"
    }
    
    print(f"Sending mock WhatsApp webhook to {url}...")
    try:
        response = requests.post(url, data=data)
        print(f"Status: {response.status_code}")
        print("Response XML:")
        print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_whatsapp_webhook()
