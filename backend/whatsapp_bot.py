"""
whatsapp_bot.py — WhatsApp Bot for Trinetra Deepfake Detection.

Receives media via the Meta WhatsApp Cloud API, runs the full local +
cloud forensic pipeline, generates an AI summary via Groq, and sends
a consolidated report back to the user.

Run:  python -m whatsapp_bot          (from backend/ directory)
      or:  cd backend && python whatsapp_bot.py
"""

import os
import sys
import logging
import threading
import time
import httpx
from flask import Flask, request, jsonify
from dotenv import load_dotenv

# Ensure backend/src is importable
_backend_dir = os.path.dirname(os.path.abspath(__file__))
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

from src.inference.infer import run_inference
from src.inference.ai_summary import generate_ai_summary

# Load environment variables
env_path = os.path.join(_backend_dir, ".env")
load_dotenv(dotenv_path=env_path)

# ── Configuration ──
ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")
PHONE_ID = os.getenv("WHATSAPP_PHONE_ID")
VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN")
TEMP_DOWNLOAD_DIR = os.path.join(_backend_dir, "processed_data", "whatsapp_media")

os.makedirs(TEMP_DOWNLOAD_DIR, exist_ok=True)

# ── Logging ──
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Trinetra.WhatsAppBot")

app = Flask(__name__)

# Deduplication: track processed message IDs to avoid duplicate responses
_processed_messages: set[str] = set()
_msg_lock = threading.Lock()


def cleanup_processed_messages():
    """Periodically clear the processed messages set to prevent memory leaks."""
    while True:
        time.sleep(3600)  # Cleanup every hour
        with _msg_lock:
            _processed_messages.clear()
            logger.info("Cleared processed messages cache.")

# Start cleanup thread
threading.Thread(target=cleanup_processed_messages, daemon=True).start()


# ─────────────────────────────────────────────
#  Helpers
# ─────────────────────────────────────────────

def send_whatsapp_message(to: str, text: str) -> None:
    """
    Sends a text message to the user on WhatsApp.
    
    Think of this as the bot's 'voice'. We use the Meta Graph API to send 
    structured JSON data that WhatsApp turns into a chat bubble on the user's phone.
    """
    url = f"https://graph.facebook.com/v18.0/{PHONE_ID}/messages"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": text},
    }
    try:
        response = httpx.post(url, json=payload, headers=headers)
        if response.status_code != 200:
            logger.error(f"Failed to send message: {response.status_code} - {response.text}")
        response.raise_for_status()
        logger.info(f"Message sent to {to}")
    except Exception as e:
        logger.error(f"Error in send_whatsapp_message: {e}")


def mark_as_read(message_id: str) -> None:
    """Mark a message as read so Meta stops retrying delivery."""
    url = f"https://graph.facebook.com/v18.0/{PHONE_ID}/messages"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "status": "read",
        "message_id": message_id,
    }
    try:
        response = httpx.post(url, json=payload, headers=headers)
        if response.status_code != 200:
            logger.error(f"Failed to mark message as read: {response.status_code} - {response.text}")
        response.raise_for_status()
    except Exception as e:
        logger.error(f"Failed to mark message as read: {e}")


def download_media(media_id: str) -> str | None:
    """
    Downloads images or videos from WhatsApp's cloud storage.
    
    When someone sends us a photo, WhatsApp doesn't send the pixels directly. 
    Instead, they give us a 'Media ID'. We have to use that ID to ask Meta for 
    the actual file, download it locally, and save it for our AI to scan.
    """
    url = f"https://graph.facebook.com/v18.0/{media_id}"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}

    try:
        resp = httpx.get(url, headers=headers)
        resp.raise_for_status()
        media_url = resp.json().get("url")
        mime_type = resp.json().get("mime_type", "")

        file_resp = httpx.get(media_url, headers=headers)
        file_resp.raise_for_status()

        # Determine extension
        ext = ".jpg"
        if "video" in mime_type:
            ext = ".mp4"
        elif "audio" in mime_type:
            ext = ".mp3"
        elif "png" in mime_type:
            ext = ".png"

        file_path = os.path.join(TEMP_DOWNLOAD_DIR, f"{media_id}{ext}")
        with open(file_path, "wb") as f:
            f.write(file_resp.content)

        return file_path
    except Exception as e:
        logger.error(f"Media download failed: {e}")
        return None


# ─────────────────────────────────────────────
#  Webhook endpoints
# ─────────────────────────────────────────────

@app.route("/webhook", methods=["GET"])
def verify_webhook():
    """Verify webhook for Meta."""
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        logger.info("Webhook verified successfully!")
        return challenge or "", 200
    return "Forbidden", 403


def process_message_async(sender: str, msg_type: str, msg_data: dict, msg_id: str) -> None:
    """
    The heavy lifter of the bot. This handles the 'thinking' in the background.
    
    Why is it 'async' / in a separate thread?
    Meta requires our server to respond with an 'OK' within 10 seconds. 
    However, deepfake detection can take 20-30 seconds. If we did it all in 
    the main thread, Meta would think we crashed and keep retrying the message.
    So, we say 'OK' immediately and do the hard work here in the background.
    """
    try:
        # Tell Meta we received it — stops retry deliveries
        mark_as_read(msg_id)

        if msg_type == "text":
            text = msg_data.get("body", "").lower()
            if "hi" in text or "hello" in text:
                send_whatsapp_message(
                    sender,
                    "Welcome to Trinetra! 🔍\nSend me an image or video to check for deepfakes.",
                )
            else:
                send_whatsapp_message(
                    sender,
                    "I'm ready. Please send a media file (Image/Video/Audio) for forensic analysis.",
                )

        elif msg_type in ["image", "video", "audio"]:
            media_id = msg_data.get("id")
            send_whatsapp_message(sender, f"⏳ Analyzing your {msg_type}... Please wait.")

            # Download
            file_path = download_media(media_id)
            if not file_path:
                send_whatsapp_message(sender, "Sorry, I couldn't download the file. Please try again.")
                return

            # ── Run Analysis (local + cloud) ──
            result = run_inference(file_path)

            # Build compact report
            rd = result.rd_result
            response_text = f"🔍 *Trinetra Report*\n"

            if result.label == "AUDIO":
                response_text += "🤖 Local AI: ℹ️ Audio (Cloud only)\n"
            else:
                local_icon = "🟢" if result.label == "REAL" else "🔴"
                response_text += f"🤖 Local AI: {local_icon} {result.label} ({result.fake_probability * 100:.1f}%)\n"

            # Cloud verdict (1 line)
            if rd:
                if rd.get("status") in ("ERROR", "SKIPPED"):
                    response_text += f"☁️ Cloud: ⚠️ {rd.get('error', 'unavailable')}\n"
                else:
                    rd_status = rd.get("status")
                    rd_icon = "🟢" if rd_status == "AUTHENTIC" else "🔴" if rd_status == "MANIPULATED" else "🟡"
                    response_text += f"☁️ Cloud: {rd_icon} {rd_status} ({rd.get('score', 0) * 100:.1f}%)\n"

                    # Only show top 3 most suspicious models
                    models = rd.get("models", [])
                    if models:
                        sorted_models = sorted(models, key=lambda m: m.get("score") if m.get("score") is not None else 0, reverse=True)
                        top = sorted_models[:3]
                        response_text += "📊 Top signals:\n"
                        for m in top:
                            name = m.get("model_name") or m.get("name") or m.get("model") or "model"
                            score = m.get("score", 0)
                            response_text += f"  • {name}: {score*100:.1f}%\n"

            # AI Summary (compact)
            ai_summary = generate_ai_summary(result)
            if ai_summary:
                response_text += f"\n🧠 *Summary*: {ai_summary}"

            send_whatsapp_message(sender, response_text)

            # Clean up downloaded file
            try:
                os.remove(file_path)
            except OSError:
                pass

    except Exception as e:
        logger.error(f"Error in background process: {e}", exc_info=True)


@app.route("/webhook", methods=["POST"])
def handle_webhook():
    """Handle incoming WhatsApp messages."""
    data = request.get_json(silent=True, force=True) or {}

    try:
        if data.get("entry"):
            for entry in data["entry"]:
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    messages = value.get("messages", [])

                    for msg in messages:
                        msg_id = msg.get("id")
                        sender = msg.get("from")
                        msg_type = msg.get("type")

                        # Skip already-processed messages (thread-safe)
                        with _msg_lock:
                            if msg_id in _processed_messages:
                                logger.info(f"Skipping duplicate message {msg_id}")
                                continue
                            _processed_messages.add(msg_id)

                        logger.info(f"Dispatching background task for {sender} (type: {msg_type})")
                        
                        # Extract data based on type
                        msg_data = msg.get(msg_type, {}) if msg_type != "text" else msg.get("text", {})
                        
                        # Start background processing to avoid Meta webhook timeout (10s)
                        thread = threading.Thread(
                            target=process_message_async, 
                            args=(sender, msg_type, msg_data, msg_id)
                        )
                        thread.start()

    except Exception as e:
        logger.error(f"Error handling webhook: {e}", exc_info=True)

    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(port=5000, debug=False)
