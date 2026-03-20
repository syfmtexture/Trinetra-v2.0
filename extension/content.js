/**
 * content.js — Region Selection & UI for Trinetra
 * 
 * Provides:
 *   - Transparent overlay selection layer
 *   - Drag-to-select functionality
 *   - Image cropping via Canvas
 *   - Local API communication
 *   - Premium result UI
 */

(function () {
  if (window._trinetraInitialized) return;
  window._trinetraInitialized = true;

  let selectionBox = null;
  let startX, startY;
  let isSelecting = false;
  let overlay = null;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggle-selection") {
      activateSelectionMode();
    }
  });

  function activateSelectionMode() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'trinetra-selection-overlay';
    document.body.appendChild(overlay);

    overlay.addEventListener('mousedown', startSelection);
    overlay.addEventListener('mousemove', updateSelection);
    overlay.addEventListener('mouseup', finishSelection);

    // Add escape listener to cancel
    window.addEventListener('keydown', cancelSelection);
  }

  function cancelSelection(e) {
    if (e.key === 'Escape') {
      cleanup();
    }
  }

  function cleanup() {
    if (overlay) {
      document.body.removeChild(overlay);
      overlay = null;
    }
    if (selectionBox) {
      selectionBox.remove();
      selectionBox = null;
    }
    window.removeEventListener('keydown', cancelSelection);
  }

  function startSelection(e) {
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;

    selectionBox = document.createElement('div');
    selectionBox.className = 'trinetra-selection-box';
    overlay.appendChild(selectionBox);

    updateSelection(e);
  }

  function updateSelection(e) {
    if (!isSelecting) return;

    const x = Math.min(e.clientX, startX);
    const y = Math.min(e.clientY, startY);
    const width = Math.abs(e.clientX - startX);
    const height = Math.abs(e.clientY - startY);

    selectionBox.style.left = x + 'px';
    selectionBox.style.top = y + 'px';
    selectionBox.style.width = width + 'px';
    selectionBox.style.height = height + 'px';
  }

  function finishSelection(e) {
    if (!isSelecting) return;
    isSelecting = false;

    const rect = selectionBox.getBoundingClientRect();
    if (rect.width < 5 || rect.height < 5) {
      cleanup();
      return;
    }

    // Add scanning animation
    selectionBox.classList.add('scanning');

    // Prepare for Capture
    showToast("🔍 Capturing region...");

    // Ask background to take a screenshot
    chrome.runtime.sendMessage({ action: "capture-screenshot" }, (response) => {
      cleanup();
      if (response && response.dataUrl) {
        processScreenshot(response.dataUrl, rect);
      } else {
        showToast("❌ Screenshot failed.", "error");
      }
    });
  }

  function processScreenshot(dataUrl, rect) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const dpr = window.devicePixelRatio || 1;
      // We must map the screen coordinates (rect) to the actual dataUrl pixels.
      // captureVisibleTab usually returns the tab at the current zoom/dpr.

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.drawImage(
        img,
        rect.left * dpr, rect.top * dpr, rect.width * dpr, rect.height * dpr,
        0, 0, canvas.width, canvas.height
      );

      const croppedBase64 = canvas.toDataURL('image/png');
      analyzeImage(croppedBase64);
    };
    img.src = dataUrl;
  }

  function analyzeImage(base64Data) {
    showToast("🔬 Running Forensic Triage...", "loading");

    fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64_data: base64Data })
    })
      .then(r => r.json())
      .then(data => {
        showResultPopup(data);
      })
      .catch(err => {
        showToast("🔴 API Offline. Ensure Trinetra server is running.", "error");
        console.error("Trinetra API error:", err);
      });
  }

  // --- UI Helpers ---

  function showToast(text, type = "info") {
    let toast = document.getElementById('trinetra-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'trinetra-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.className = `trinetra-toast show ${type}`;

    if (type !== "loading" && type !== "info") {
      setTimeout(() => { toast.classList.remove('show'); }, 4000);
    }
  }

  function showResultPopup(data) {
    // Remove toast
    const toast = document.getElementById('trinetra-toast');
    if (toast) toast.classList.remove('show');

    // Remove old widget if exists
    const oldWidget = document.getElementById('trinetra-widget-container');
    if (oldWidget) oldWidget.remove();

    // Create Result Widget
    const widget = document.createElement('div');
    widget.id = 'trinetra-widget-container';
    widget.className = 'trinetra-widget';

    const isFake = data.primary_verdict === "FAKE";
    const statusClass = isFake ? "status-fake" : "status-real";

    // Format RD info
    let rdHtml = '';
    if (data.rd_status && data.rd_status !== "DISABLED" && data.rd_status !== "ERROR") {
      const isRdFake = ["FAKE", "MANIPULATED", "SUSPICIOUS"].includes(data.rd_status);
      const rdTextClass = isRdFake ? "fake-text" : "real-text";
      const rdScoreText = data.rd_score ? `(${(data.rd_score * 100).toFixed(1)}%)` : '';
      rdHtml = `
         <div class="trinetra-detail-row">
            <span class="trinetra-detail-label">Cloud Analysis</span>
            <span class="trinetra-detail-value ${rdTextClass}">${data.rd_status} ${rdScoreText}</span>
         </div>
       `;
    } else {
      rdHtml = `
         <div class="trinetra-detail-row">
            <span class="trinetra-detail-label">Cloud Analysis</span>
            <span class="trinetra-detail-value" style="color: #9ca3af; font-style: italic;">Unavailable</span>
         </div>
       `;
    }

    const localTextClass = data.local_label === "FAKE" ? "fake-text" : "real-text";

    widget.innerHTML = `
        <div class="trinetra-widget-header" id="trinetra-widget-header">
           <div class="trinetra-widget-title">
               <svg style="margin-right: 4px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
               Trinetra
           </div>
           <div class="trinetra-widget-close" id="trinetra-widget-close">&times;</div>
        </div>
        <div class="trinetra-widget-tabs">
            <div class="trinetra-tab active">Overview</div>
            <div class="trinetra-tab">History</div>
            <div class="trinetra-tab">Settings</div>
        </div>
        <div class="trinetra-widget-body">
            <div class="trinetra-verdict-box ${statusClass}">
               <div class="trinetra-verdict-label">${data.primary_verdict}</div>
               <div class="trinetra-verdict-sub">Consolidated Forensic Verdict</div>
            </div>

            <div class="trinetra-details-grid">
               <div class="trinetra-detail-row">
                  <span class="trinetra-detail-label">Local Model</span>
                  <span class="trinetra-detail-value ${localTextClass}">${data.local_label} (${data.local_confidence.toFixed(1)}%)</span>
               </div>
               ${rdHtml}
               <div class="trinetra-detail-row">
                  <span class="trinetra-detail-label">Processing Time</span>
                  <span class="trinetra-detail-value">${data.latency_ms}ms</span>
               </div>
            </div>

            <div class="trinetra-summary-text">
               ${data.forensic_summary}
            </div>
        </div>
    `;

    document.body.appendChild(widget);

    // Close Button
    widget.querySelector('#trinetra-widget-close').onclick = () => widget.remove();

    // Draggable Logic
    const header = widget.querySelector('#trinetra-widget-header');
    let isDragging = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

    header.addEventListener("mousedown", dragStart);

    function dragStart(e) {
      if (e.target.id === 'trinetra-widget-close') return;
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      isDragging = true;
    }

    document.addEventListener("mouseup", () => {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        widget.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    });
  }

})();
