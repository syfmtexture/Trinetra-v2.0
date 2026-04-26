# Trinetra — Deepfake Forensic Analyzer

Trinetra is a comprehensive hybrid deepfake detection system that combines an optimized local AI model (EfficientNet-B4 + LSTM) with cloud-based verification (Reality Defender). It features a full forensic suite providing temporal anomaly detection, Explainable AI (XAI) using Grad-CAM, error level analysis, and geometric landmark jitter metrics.

## Features

- **Local Inference:** Fast, on-device analysis using a hybrid EfficientNet-B4 + LSTM architecture for tracking spatial and temporal features.
- **Cloud Verification:** Integration with the Reality Defender API to serve as a robust fallback for verification analysis on demanding media.
- **Deep Forensics Dashboard:**
  - Executive Summaries
  - Grad-CAM Spatial Evidence for localized forgery highlighting
  - Temporal Anomaly and Attention Rollout Plots
  - Noise Residual Maps (Error Level Analysis)
  - Geometric Landmark Jitter Metrics
- **Chrome Extension:** Highlight regions of interest on any webpage and seamlessly scan for AI manipulation via a local background API.

## Project Structure

- `app.py`: Gradio web interface for uploading and analyzing media interactively.
- `api.py`: FastAPI server acting as a bridge between the local Trinetra model and the Chrome extension interface.
- `extension/`: The unpacked Chrome extension containing content and background scripts.
- `src/`: Core Python modules responsible for inference, configurations, and forensic methodologies.
- `model/`: Directory to store model weights and checkpoints (e.g., `best_model.pt`).

## Setup and Installation

### 1. Requirements

Ensure you have Python 3.9+ installed. Install all the required packages via pip:

```bash
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the project's root directory. You will need to add your Reality Defender API key for the cloud verification features to function properly:

```env
RD_API_KEY=your_api_key_here
```

### 3. Model Weights

The core AI model (`best_model.pt`) is excluded from this repository due to its large size (~250MB). To run the analysis features:

1. Obtain the model weights (e.g., from the project's releases or an external download link).
2. Place the `best_model.pt` file inside the `model/` directory.
3. Ensure the directory structure looks exactly like this: `Trinetra/model/best_model.pt`.

### 4. Running the Interfaces

**Gradio Web App:**

To serve the interactive visual anomaly detection interface:
```bash
python app.py
```
*Navigate to http://127.0.0.1:7860/ in your browser.*

**Local API (For Chrome Extension):**

To serve the backend FastAPI endpoint to consume Chrome extension requests:
```bash
python api.py
```
*Runs by default on http://127.0.0.1:8000/*

**WhatsApp Bot:**

To run the deepfake scanner as a WhatsApp chatbot (requires Meta Cloud API credentials in your `.env` file):
```bash
cd backend
python whatsapp_bot.py
```
*Runs on http://127.0.0.1:5000/ — expose this port via ngrok for the Meta webhook.*

### 5. Chrome Extension Installation

1. Navigate to `chrome://extensions/` in Chrome or any Chromium-based browser.
2. Enable "Developer Mode" in the top right corner.
3. Click "Load unpacked" and select the `extension/` directory.

## Models and Architecture

- **Primary Pipeline:** Extracts frame sequences or single images, applies Grad-CAM on CNN features (EfficientNet-B4), and calculates temporal divergence using an LSTM layer. Returns a localized heatmap, probability scoring, and extracted noise metrics.
- **Cloud Layer:** As a fallback and verification measure for unsupported scenarios, API calls to the `Reality Defender` endpoint confirm visual irregularities mapped against advanced cloud models.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
