/**
 * content.js — Region Selection & UI for Trinetra v2.0
 * 
 * Provides:
 *   - Transparent overlay selection layer
 *   - Drag-to-select functionality
 *   - Image cropping via Canvas
 *   - Local API communication with toggle awareness
 *   - Brand-themed result UI with icons
 */

(function() {
  // ── Message listener — always register, even on re-injection ──
  if (!window._trinetraListenerRegistered) {
    window._trinetraListenerRegistered = true;
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "ping") {
        sendResponse({ status: "pong" });
        return false;
      }
      if (request.action === "toggle-selection") {
        window._trinetraActivate?.();
        sendResponse({ status: "active" });
        return false;
      }
    });
  }

  // ── Guard against double-init of UI logic ──
  if (window._trinetraInitialized) return;
  window._trinetraInitialized = true;

  let selectionBox = null;
  let startX, startY;
  let isSelecting = false;
  let overlay = null;

  // Helper to get extension icon URLs
  function getIconUrl(name) {
    return chrome.runtime.getURL(`icons/${name}`);
  }

  function activateSelectionMode() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'trinetra-selection-overlay';
    document.body.appendChild(overlay);

    overlay.addEventListener('mousedown', startSelection);
    overlay.addEventListener('mousemove', updateSelection);
    overlay.addEventListener('mouseup', finishSelection);
    
    window.addEventListener('keydown', cancelSelection);
  }

  // Expose for the message listener
  window._trinetraActivate = activateSelectionMode;

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

    selectionBox.classList.add('scanning');
    showToast("🔍 Capturing region...");
    
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
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const dpr = window.devicePixelRatio || 1;
      
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

    // Read toggle settings
    chrome.storage.local.get(['useLocal', 'useCloud'], (settings) => {
      const useLocal = settings.useLocal !== undefined ? settings.useLocal : true;
      const useCloud = settings.useCloud !== undefined ? settings.useCloud : true;

      fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64_data: base64Data,
          use_local: useLocal,
          use_cloud: useCloud
        })
      })
      .then(r => r.json())
      .then(data => {
        showResultPopup(data);
      })
      .catch(err => {
          showToast("🔴 API Offline. Ensure Trinetra server is running.", "error");
          console.error("Trinetra API error:", err);
      });
    });
  }

  // ═══ UI Helpers ═══

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

    // Create Result Modal
    const modal = document.createElement('div');
    modal.className = 'trinetra-modal';
    
    const isFake = data.primary_verdict === "FAKE";
    const isUncertain = data.primary_verdict === "UNCERTAIN" || data.primary_verdict === "INCONCLUSIVE";
    const statusClass = isFake ? "status-fake" : "status-real";
    
    // Pick the correct verdict icon
    let verdictIcon, verdictIconAlt;
    if (isFake) {
      verdictIcon = getIconUrl('siren.png');
      verdictIconAlt = 'Fake Detected';
    } else if (isUncertain) {
      verdictIcon = getIconUrl('question.png');
      verdictIconAlt = 'Uncertain';
    } else {
      verdictIcon = getIconUrl('checkmark.png');
      verdictIconAlt = 'Authentic';
    }

    // Format RD info
    let rdHtml = '';
    if (data.rd_status && data.rd_status !== "DISABLED" && data.rd_status !== "ERROR") {
       const isRdFake = ["FAKE", "MANIPULATED", "SUSPICIOUS"].includes(data.rd_status);
       const rdTextClass = isRdFake ? "fake-text" : "real-text";
       const rdScoreText = data.rd_score ? `(${(data.rd_score * 100).toFixed(1)}%)` : '';
       rdHtml = `
         <div class="trinetra-result-cell">
            <span class="trinetra-label">RD Cloud · Priority</span>
            <span class="trinetra-value ${rdTextClass}">${data.rd_status} ${rdScoreText}</span>
         </div>
       `;
    } else {
       rdHtml = `
         <div class="trinetra-result-cell">
            <span class="trinetra-label">RD Cloud</span>
            <span class="trinetra-value muted">${data.rd_status || 'Offline'}</span>
         </div>
       `;
    }

    const localTextClass = data.local_label === "FAKE" ? "fake-text" : "real-text";

    modal.innerHTML = `
      <div class="trinetra-modal-content">
        <div class="trinetra-close">✕</div>
        
        <div class="trinetra-modal-header">
          <div class="trinetra-modal-brand">
            <img src="${getIconUrl('logo.png')}" class="trinetra-modal-logo" alt="Trinetra">
            <span class="trinetra-modal-title">TRINETRA</span>
          </div>
          <span class="trinetra-latency">${data.latency_ms}ms</span>
        </div>
        
        <div class="trinetra-verdict-main ${statusClass}">
           <img src="${verdictIcon}" class="trinetra-verdict-icon" alt="${verdictIconAlt}">
           <div class="trinetra-verdict-text">
              <div class="trinetra-verdict-label">${data.primary_verdict}</div>
              <div class="trinetra-verdict-sub">CONSOLIDATED FORENSIC VERDICT</div>
           </div>
        </div>

        <div class="trinetra-results-grid">
           <div class="trinetra-result-cell">
              <span class="trinetra-label">Local Model · Hybrid</span>
              <span class="trinetra-value ${localTextClass}">${data.local_label} (${data.local_confidence.toFixed(1)}%)</span>
           </div>
           ${rdHtml}
        </div>

        <div class="trinetra-summary">
           ${data.forensic_summary}
        </div>

        <div class="trinetra-footer">
           TRINETRA v2.0 · ${data.rd_status && data.rd_status !== "DISABLED" ? "RD CLOUD API" : "LOCAL ENGINE"}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.querySelector('.trinetra-close').onclick = () => modal.remove();
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

})();
