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
load_dotenv()

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


# ─────────────────────────────────────────────
#  Helpers
# ─────────────────────────────────────────────

def send_whatsapp_message(to: str, text: str) -> None:
    """Send a text message via WhatsApp Cloud API."""
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
        httpx.post(url, json=payload, headers=headers)
    except Exception as e:
        logger.error(f"Failed to mark message as read: {e}")


def download_media(media_id: str) -> str | None:
    """Download media from WhatsApp servers using media_id."""
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
        return challenge, 200
    return "Forbidden", 403


@app.route("/webhook", methods=["POST"])
def handle_webhook():
    """Handle incoming WhatsApp messages."""
    data = request.json

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

                        # Tell Meta we received it — stops retry deliveries
                        mark_as_read(msg_id)

                        logger.info(f"New message from {sender} (type: {msg_type})")

                        if msg_type == "text":
                            text = msg.get("text", {}).get("body", "").lower()
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
                            media_data = msg.get(msg_type)
                            media_id = media_data.get("id")

                            send_whatsapp_message(sender, f"⏳ Analyzing your {msg_type}... Please wait.")

                            # Download
                            file_path = download_media(media_id)
                            if not file_path:
                                send_whatsapp_message(sender, "Sorry, I couldn't download the file. Please try again.")
                                continue

                            # ── Run Analysis (local + cloud) ──
                            result = run_inference(file_path)

                            # Build compact report
                            local_icon = "🟢" if result.label == "REAL" else "🔴"
                            rd = result.rd_result

                            # Header + Local verdict (1 line)
                            response_text = (
                                f"🔍 *Trinetra Report*\n"
                                f"🤖 Local: {local_icon} {result.label} ({result.fake_probability * 100:.1f}%)\n"
                            )

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
                                        sorted_models = sorted(models, key=lambda m: m.get("score", 0), reverse=True)
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
        logger.error(f"Error handling webhook: {e}", exc_info=True)

    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(port=5000, debug=False)
