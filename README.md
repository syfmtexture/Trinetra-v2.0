# Trinetra — Deepfake Forensic Analyzer

Trinetra is a comprehensive hybrid deepfake detection system that combines an optimized local AI model (EfficientNet-B4 + LSTM) with cloud-based verification (Reality Defender). It features a full forensic suite providing temporal anomaly detection, Explainable AI (XAI) using Grad-CAM, error level analysis, and geometric landmark jitter metrics.

## Features

- **Local Inference:** Fast, on-device analysis using a hybrid EfficientNet-B4 + LSTM architecture for spatial and temporal features.
- **Cloud Verification:** Integration with Reality Defender API for state-of-the-art fallback/verification analysis on demanding media.
- **Deep Forensics Dashboard:**
  - Executive Summaries
  - Grad-CAM Spatial Evidence
  - Temporal Anomaly and Attention Rollout Plots
  - Noise Residual Maps (Error Level Analysis)
  - Geometric Landmark Jitter
- **Chrome Extension:** Highlight regions of interest on any webpage and scan for AI manipulation seamlessly via a local background API.

## Project Structure

- `app.py`: Gradio web interface for uploading and analyzing media interactively.
- `api.py`: FastAPI server that bridges the local Trinetra model with the Chrome extension interface.
- `extension/`: Unpacked Chrome extension with content and background scripts.
- `src/`: Core Python modules for inference, configurations, and forensic methodologies.
- `model/`: Weights and checkpoints (e.g., `best_model.pt`).

## Setup and Installation

### 1. Requirements

Ensure you have Python 3.9+ installed. Install all the listed packages:

```bash
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the project's root directory with your Reality Defender API key for cloud verification (if enabled):

```env
RD_API_KEY=your_api_key_here
```

### 3. Model Weights

Place your trained model checkpoints in the `model/` directory. The main expected file is `best_model.pt` containing the `EfficientNet-B4 + LSTM` PyTorch state dict.

### 4. Running the Interfaces

**Gradio Web App:**

Serve the interactive visual anomaly detection interface:
```bash
python app.py
```
*Navigate to http://127.0.0.1:7860/*

**Local API (For Chrome Extension):**

Serve the backend FastAPI endpoint to consume Chrome extension requests:
```bash
python api.py
```
*Runs by default on http://127.0.0.1:8000/*

### 5. Chrome Extension Installation

1. Navigate to `chrome://extensions/` in Chrome or Chromium-based browsers.
2. Enable "Developer Mode" in the top right.
3. Click "Load unpacked" and select the `extension/` directory.

## Models and Architecture

- **Primary Pipeline:** Extracts frame sequences or single images, applies Grad-CAM on CNN features (EfficientNet-B4), and calculates temporal divergence with an LSTM layer. Results return a localized heatmap, probability scoring, and extracted noise metrics.
- **Cloud Layer:** As a fallback and verification measure for unsupported scenarios, calls to the `Reality Defender` endpoint confirm visual irregularities mapped against cloud models.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
