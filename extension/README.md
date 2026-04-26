# Trinetra Chrome Extension — In-Browser Media Scanner

## Overview

The Trinetra Chrome Extension is a lightweight, high-utility client designed to bring the power of the Trinetra Deepfake Forensic Analyzer directly to the user's browsing experience. Operating via Manifest V3, the extension allows users to right-click, highlight, or selectively scan visual media elements on any webpage and forward them to the local Trinetra inference engine for real-time authentication.

---

## Architecture & Workflow

The extension is modularized into distinct operational contexts, ensuring security and DOM isolation:

### 1. Background Service Worker (`background.js`)
- Handles the core event listening and inter-process communication.
- Manages the context menus (right-click options to "Scan Image with Trinetra").
- Orchestrates asynchronous HTTP requests to the local Trinetra backend API (`http://localhost:8000/analyze`).

### 2. Content Scripts (`content.js`, `content.css`)
- Injected securely into the host webpage's Document Object Model (DOM).
- Renders the non-intrusive Trinetra scanning overlay directly on the page, highlighting processed images and displaying confidence metrics (e.g., green for authentic, red for manipulated).
- Handles user interactions mapping to visual media elements.

### 3. Pop-up Interface (`popup.html`, `popup.js`, `popup.css`)
- Provides a clean, immediate UI accessible from the browser's extension toolbar.
- Displays connection status to the local API, global settings, and historical scan logs for the active session.

---

## Security & Permissions (Manifest V3)

The extension complies with modern Chrome Web Store policies, operating strictly within declared parameters:
- **`activeTab`**: Allows temporary access to the currently visible tab for DOM injection.
- **`contextMenus`**: Enables the custom right-click scanning functionality.
- **`scripting`**: Utilized for programmatic injection of content scripts.
- **No persistent tracking**: The extension operates ephemerally, ensuring user privacy and data security.

---

## Installation (Developer Mode)

To install and run the extension locally:

1. Open a Chromium-based browser (Google Chrome, Brave, Edge).
2. Navigate to the extensions dashboard via the URL bar: `chrome://extensions/`
3. Toggle the **"Developer mode"** switch in the top right corner.
4. Click the **"Load unpacked"** button.
5. Select the `extension/` directory from the Trinetra repository.
6. The Trinetra icon will appear in your extensions toolbar.

---

## Usage Requirements

For the extension to successfully process media, the local Trinetra backend API must be active and accessible.
Ensure the FastAPI server is running before initiating a scan:
```bash
# In the Trinetra/backend directory:
python api.py
```
*The extension is hardcoded to target `http://localhost:8000/`. Modify `background.js` if your local port configuration differs.*
