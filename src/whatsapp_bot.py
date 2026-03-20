import os
import logging
import httpx
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from src.inference.reality_defender import analyze_with_rd

# Load environment variables
load_dotenv()

# Configuration
ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")
PHONE_ID = os.getenv("WHATSAPP_PHONE_ID")
VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN")
TEMP_DOWNLOAD_DIR = "processed_data/whatsapp_media"

# Ensure download directory exists
os.makedirs(TEMP_DOWNLOAD_DIR, exist_ok=True)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Trinetra.WhatsAppBot")

app = Flask(__name__)

def send_whatsapp_message(to, text):
    """Sends a text message via WhatsApp Cloud API."""
    url = f"https://graph.facebook.com/v18.0/{PHONE_ID}/messages"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": text}
    }
    try:
        response = httpx.post(url, json=payload, headers=headers)
        if response.status_code != 200:
            logger.error(f"Failed to send message: {response.status_code} - {response.text}")
        response.raise_for_status()
        logger.info(f"Message sent to {to}")
    except Exception as e:
        logger.error(f"Error in send_whatsapp_message: {e}")

def download_media(media_id):
    """Downloads media from WhatsApp servers using media_id."""
    # 1. Get media URL
    url = f"https://graph.facebook.com/v18.0/{media_id}"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    
    try:
        resp = httpx.get(url, headers=headers)
        resp.raise_for_status()
        media_url = resp.json().get("url")
        mime_type = resp.json().get("mime_type")
        
        # 2. Download the actual file
        file_resp = httpx.get(media_url, headers=headers)
        file_resp.raise_for_status()
        
        # Determine extension
        ext = ".jpg" # default
        if "video" in mime_type: ext = ".mp4"
        elif "audio" in mime_type: ext = ".mp3"
        elif "png" in mime_type: ext = ".png"
        
        file_path = os.path.join(TEMP_DOWNLOAD_DIR, f"{media_id}{ext}")
        with open(file_path, "wb") as f:
            f.write(file_resp.content)
            
        return file_path
    except Exception as e:
        logger.error(f"Media download failed: {e}")
        return None

@app.route("/webhook", methods=["GET"])
def verify_webhook():
    """Verify webhook for Meta."""
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        logger.info("Webhook verified successfully!")
        return challenge, 200
    return "Forbidden", 403

@app.route("/webhook", methods=["POST"])
def handle_webhook():
    """Handles incoming WhatsApp messages."""
    data = request.json
    # logger.debug(f"Received data: {data}")

    try:
        if data.get("entry"):
            for entry in data["entry"]:
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    messages = value.get("messages", [])
                    
                    for msg in messages:
                        sender = msg.get("from")
                        msg_type = msg.get("type")
                        
                        logger.info(f"New message from {sender} (type: {msg_type})")
                        
                        if msg_type == "text":
                            text = msg.get("text", {}).get("body", "").lower()
                            if "hi" in text or "hello" in text:
                                send_whatsapp_message(sender, "Welcome to Trinetra! Send me an image or video to check for deepfakes.")
                            else:
                                send_whatsapp_message(sender, "I'm ready. Please send a media file (Image/Video/Audio) for forensic analysis.")
                        
                        elif msg_type in ["image", "video", "audio"]:
                            media_data = msg.get(msg_type)
                            media_id = media_data.get("id")
                            
                            send_whatsapp_message(sender, f"Analyzing your {msg_type}... Please wait.")
                            
                            # Download
                            file_path = download_media(media_id)
                            if not file_path:
                                send_whatsapp_message(sender, "Sorry, I couldn't download the file. Please try again.")
                                continue
                            
                            # Run Analysis
                            result = analyze_with_rd(file_path)
                            
                            # Format Response
                            if result.status == "SKIPPED":
                                response_text = f"🚨 {result.error}"
                            elif result.status == "ERROR":
                                response_text = f"❌ Analysis Error: {result.error}"
                            else:
                                color = "🟢" if result.status == "AUTHENTIC" else "🔴" if result.status == "MANIPULATED" else "🟡"
                                response_text = (
                                    f"--- Trinetra Analysis Result ---\n"
                                    f"Status: {color} {result.status}\n"
                                    f"Manipulation Probability: {result.overall_score * 100:.1f}%\n"
                                    f"Request ID: {result.request_id}\n"
                                )
                            
                            send_whatsapp_message(sender, response_text)
                            
                            # Optional: Clean up
                            # os.remove(file_path)

    except Exception as e:
        logger.error(f"Error handling webhook: {e}")

    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    # In production, use Gunicorn/Uvicorn
    app.run(port=5000, debug=False)
