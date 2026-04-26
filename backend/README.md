# Trinetra Backend — Forensic Inference & API Services

## Overview

The Trinetra Backend is a robust, production-grade API and inference engine designed for high-fidelity deepfake and media manipulation detection. It encapsulates a hybrid architecture, combining lightweight, fast local inference using state-of-the-art neural networks with high-confidence cloud-based verification via the Reality Defender platform.

This component serves three primary interfaces:
1. **Next.js Frontend (Dashboard):** For in-depth forensic investigation and visualization.
2. **Chrome Extension:** For on-the-fly, localized webpage media scanning.
3. **WhatsApp Bot Integration:** Serving as a standalone consumer-facing chatbot service via Meta's Cloud API.

---

## System Architecture

### Core Components
- **FastAPI Core (`api.py`):** High-performance asynchronous API framework managing HTTP requests, payload validation, and task routing.
- **Inference Engine (`src/`):**
  - **Spatial Feature Extraction:** Utilizes an optimized `EfficientNet-B4` backbone.
  - **Temporal Anomaly Detection:** Implements Long Short-Term Memory (LSTM) layers to catch frame-to-frame inconsistencies.
  - **XAI Engine:** Generates Explainable AI visualizations using Grad-CAM, allowing analysts to interpret the model's focus.
- **Verification Bridge:** An intelligent failover system integrating the Reality Defender API for secondary cloud-based verification on complex payloads.
- **WhatsApp Bot (`whatsapp_bot.py`):** Flask-based or FastAPI-based webhook consumer handling incoming media via Meta's WhatsApp Business API.

---

## Setup & Deployment

### Prerequisites
- Python 3.9+ (Python 3.10 recommended for async performance)
- Compute capability: CUDA-enabled GPU is highly recommended for low-latency inference.

### 1. Environment Configuration

Clone the repository and instantiate a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install production dependencies:
```bash
pip install -r requirements.txt
```

### 2. Secrets Management
Create a `.env` file in the `backend` directory to manage secrets and API configurations.

```env
# Cloud Verification API
RD_API_KEY=your_reality_defender_api_key_here

# Meta WhatsApp API Configuration
WHATSAPP_ACCESS_TOKEN=your_meta_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_VERIFY_TOKEN=your_webhook_verification_token
```

### 3. Model Provisioning
Ensure the core PyTorch model weights are correctly placed. The backend expects the model payload at:
`model/best_model.pt`

*(Note: Model weights are excluded from version control due to large binary size).*

---

## Service Execution

### Running the Primary API (Forensics & Extension API)
Initialize the FastAPI server using Uvicorn for local development or production:
```bash
# Development
python api.py
# Or using Uvicorn directly
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```
- **API Documentation:** Available automatically at `http://localhost:8000/docs` (Swagger UI).

### Running the WhatsApp Integration
To initialize the Meta webhook listener:
```bash
python whatsapp_bot.py
```
*In a production environment, this service must be exposed via HTTPS (e.g., using NGINX reverse proxy or ngrok for local testing).*

---

## Testing & Quality Assurance
The backend is equipped with unit and integration tests under the `tests/` directory.

Run the test suite using pytest:
```bash
pytest tests/ -v
```

---

## Security & Compliance
- **Payload Validation:** All incoming payloads are strictly validated using Pydantic models.
- **Stateless Design:** The API handles inference stateless-ly, ensuring no sensitive media is persisted locally beyond ephemeral processing buffers.
