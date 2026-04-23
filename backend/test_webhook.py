import requests
import json

payload = {
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "123",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "messages": [{
          "from": "1234567890",
          "id": "wamid.123",
          "timestamp": "123456",
          "type": "text",
          "text": {
            "body": "hello"
          }
        }]
      },
      "field": "messages"
    }]
  }]
}

try:
    res = requests.post("http://127.0.0.1:5000/webhook", json=payload)
    print("Response:", res.status_code, res.text)
except Exception as e:
    print("Error:", e)
