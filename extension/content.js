/**
 * content.js — Trinetra Extension: Silk UI × Indian Heritage
 * 
 * Features:
 *   - Drag-to-select region capture with silk selection box
 *   - Mandala spinner with rangoli loading animation
 *   - Animated confidence gauge with silk fill
 *   - Face crop + Grad-CAM heatmap display
 *   - Verdict panel with Yantra sacred geometry corners
 *   - Hindi branding (त्रिनेत्र — सत्य का तीसरा नेत्र)
 *   - Scan history (chrome.storage.local)
 *   - Copy forensic report to clipboard
 *   - Error states with retry + shake animation
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

  const API_URL = "http://localhost:8000/analyze";
  const HISTORY_KEY = "trinetra_scan_history";
  const MAX_HISTORY = 20;

  let selectionBox = null;
  let startX, startY;
  let isSelecting = false;
  let overlay = null;
  let loaderOverlay = null;
  let historyDrawer = null;
  let _lastBase64 = null; // for retry

  // ==========================================================
  //  §1  MESSAGE LISTENER
  // ==========================================================

  // Helper to get extension icon URLs
  function getIconUrl(name) {
    return chrome.runtime.getURL(`icons/${name}`);
  }

  // ==========================================================
  //  §2  SELECTION MODE
  // ==========================================================

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
    if (e.key === 'Escape') cleanup();
  }

  function cleanup() {
    if (overlay) { overlay.remove(); overlay = null; }
    if (selectionBox) { selectionBox.remove(); selectionBox = null; }
    window.removeEventListener('keydown', cancelSelection);
  }

  function startSelection(e) {
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;
    selectionBox = document.createElement('div');
    selectionBox.className = 'trinetra-selection-box';
    // Add scan line element
    const scanLine = document.createElement('div');
    scanLine.className = 'trinetra-scan-line';
    selectionBox.appendChild(scanLine);
    overlay.appendChild(selectionBox);
    updateSelection(e);
  }

  function updateSelection(e) {
    if (!isSelecting) return;
    const x = Math.min(e.clientX, startX);
    const y = Math.min(e.clientY, startY);
    const w = Math.abs(e.clientX - startX);
    const h = Math.abs(e.clientY - startY);
    selectionBox.style.left = x + 'px';
    selectionBox.style.top  = y + 'px';
    selectionBox.style.width  = w + 'px';
    selectionBox.style.height = h + 'px';
  }

  function finishSelection(e) {
    if (!isSelecting) return;
    isSelecting = false;

    const rect = selectionBox.getBoundingClientRect();
    if (rect.width < 5 || rect.height < 5) { cleanup(); return; }

    selectionBox.classList.add('scanning');
    showToast("🔍 Capturing region...");

    chrome.runtime.sendMessage({ action: "capture-screenshot" }, (response) => {
      cleanup();
      if (response && response.dataUrl) {
        processScreenshot(response.dataUrl, rect);
      } else {
        showErrorModal("Screenshot Failed", "Could not capture the visible tab. Try reloading the page.");
      }
    });
  }

  // ==========================================================
  //  §3  SCREENSHOT PROCESSING
  // ==========================================================

  function processScreenshot(dataUrl, rect) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      ctx.drawImage(img,
        rect.left * dpr, rect.top * dpr, rect.width * dpr, rect.height * dpr,
        0, 0, canvas.width, canvas.height
      );
      const croppedBase64 = canvas.toDataURL('image/png');
      analyzeImage(croppedBase64);
    };
    img.src = dataUrl;
  }

  // ==========================================================
  //  §4  API CALL + LOADING
  // ==========================================================

  function analyzeImage(base64Data) {
    _lastBase64 = base64Data;
    dismissToast();
    showMandalaLoader();

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64_data: base64Data })
    })
    .then(r => {
      if (!r.ok) throw new Error(`Server returned ${r.status}`);
      return r.json();
    })
    .then(data => {
      hideMandalaLoader();
      saveToHistory(data);
      showResultPopup(data);
    })
    .catch(err => {
      hideMandalaLoader();
      console.error("Trinetra API error:", err);
      showErrorModal(
        "Analysis Failed",
        err.message.includes("Failed to fetch") || err.message.includes("NetworkError")
          ? "Trinetra backend is offline. Start the server with: python api.py"
          : `Error: ${err.message}`
      );
    });
  }

  // ==========================================================
  //  §5  MANDALA LOADER
  // ==========================================================

  function showMandalaLoader() {
    if (loaderOverlay) return;
    loaderOverlay = document.createElement('div');
    loaderOverlay.className = 'trinetra-loader-overlay';
    loaderOverlay.innerHTML = `
      <div class="trinetra-mandala">
        <div class="trinetra-mandala-ring"></div>
        <div class="trinetra-mandala-ring"></div>
        <div class="trinetra-mandala-ring"></div>
        <div class="trinetra-mandala-ring"></div>
        <div class="trinetra-mandala-eye"></div>
      </div>
      <div class="trinetra-loader-text">Analyzing</div>
      <div class="trinetra-loader-subtext">त्रिनेत्र — सत्य का तीसरा नेत्र</div>
    `;
    document.body.appendChild(loaderOverlay);

    // Allow Escape to cancel
    loaderOverlay._escHandler = (e) => {
      if (e.key === 'Escape') { hideMandalaLoader(); showToast("❌ Cancelled.", "error"); }
    };
    window.addEventListener('keydown', loaderOverlay._escHandler);
  }

  function hideMandalaLoader() {
    if (!loaderOverlay) return;
    window.removeEventListener('keydown', loaderOverlay._escHandler);
    loaderOverlay.remove();
    loaderOverlay = null;
  }

  // ==========================================================
  //  §6  TOAST
  // ==========================================================

  function showToast(text, type = "info") {
    let toast = document.getElementById('trinetra-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'trinetra-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.className = `trinetra-toast show ${type}`;
    if (type === "error") {
      setTimeout(() => { toast.classList.remove('show'); }, 4000);
    }
  }

  function dismissToast() {
    const toast = document.getElementById('trinetra-toast');
    if (toast) toast.classList.remove('show');
  }

  // ==========================================================
  //  §7  RESULT POPUP
  // ==========================================================

  function showResultPopup(data) {
    dismissToast();

    const modal = document.createElement('div');
    modal.className = 'trinetra-modal';

    const isFake = data.primary_verdict === "FAKE";
    const isUncertain = data.primary_verdict === "UNCERTAIN" || data.primary_verdict === "INCONCLUSIVE";
    const statusClass = isFake ? "status-fake" : "status-real";
    const parentStatusClass = isFake ? "status-fake-parent" : "status-real-parent";
    const confidence = data.confidence_score || 0;

    // Hindi verdict text
    const hindiVerdict = isFake ? "संदिग्ध — छेड़छाड़ का संकेत" : "प्रामाणिक — मूल छवि";

    // ── Build RD cell HTML ──
    let rdHtml = '';
    if (data.rd_status && !["DISABLED", "ERROR", "SKIPPED"].includes(data.rd_status)) {
      const isRdFake = ["FAKE", "MANIPULATED", "SUSPICIOUS"].includes(data.rd_status);
      const rdTextClass = isRdFake ? "fake-text" : "real-text";
      const rdScoreText = data.rd_score ? ` (${(data.rd_score * 100).toFixed(1)}%)` : '';
      rdHtml = `
        <div class="trinetra-result-cell">
          <span class="trinetra-label">RD CLOUD ⬥ PRIORITY</span>
          <span class="trinetra-value ${rdTextClass}">${data.rd_status}${rdScoreText}</span>
        </div>`;
    } else {
      const rdStatusText = data.rd_status || 'OFFLINE';
      rdHtml = `
        <div class="trinetra-result-cell">
          <span class="trinetra-label">RD CLOUD</span>
          <span class="trinetra-value muted">${rdStatusText}</span>
        </div>`;
    }

    const localTextClass = data.local_label === "FAKE" ? "fake-text" : "real-text";

    // ── Build face crop HTML ──
    let faceCropHtml = '';
    if (data.face_crop_base64) {
      faceCropHtml = `
        <div class="trinetra-face-crop-circle">
          <img src="data:image/png;base64,${data.face_crop_base64}" alt="Face" />
        </div>`;
    } else {
      faceCropHtml = `<div class="trinetra-no-face">No Face<br/>Detected</div>`;
    }

    // ── Build Grad-CAM HTML ──
    let gradcamHtml = '';
    if (data.gradcam_base64) {
      gradcamHtml = `
        <div class="trinetra-gradcam-wrap">
          <img class="trinetra-gradcam-img" src="data:image/png;base64,${data.gradcam_base64}" alt="Grad-CAM Heatmap" />
        </div>`;
    } else {
      gradcamHtml = `<div class="trinetra-no-gradcam">No heatmap<br/>available</div>`;
    }

    // ── Gauge SVG ──
    const gaugeRadius = 80;
    const gaugeCircumference = Math.PI * gaugeRadius; // half circle
    const gaugeFillPct = confidence / 100;
    const gaugeDashoffset = gaugeCircumference * (1 - gaugeFillPct);
    const gaugeColor = isFake ? 'var(--fake-color)' : 'var(--real-color)';

    // ── Data source ──
    const isRdActive = data.rd_status && !["DISABLED", "ERROR", "SKIPPED", "OFFLINE"].includes(data.rd_status);
    const sourceDot = isRdActive ? 'online' : 'offline';
    const sourceText = isRdActive ? 'RD CLOUD API' : 'LOCAL ENGINE';

    // ── Latency formatting ──
    const latencyText = typeof data.latency_ms === 'number' ? `${data.latency_ms.toFixed(0)}ms` : '--';

    modal.innerHTML = `
      <div class="trinetra-modal-content">
        <div class="trinetra-modal-inner">

          <!-- HEADER -->
          <div class="trinetra-header">
            <div class="trinetra-brand-group">
              <span class="trinetra-brand">TRINETRA <span>// V2</span></span>
              <span class="trinetra-hindi-sub">त्रिनेत्र — सत्य का तीसरा नेत्र</span>
            </div>
            <div class="trinetra-header-right">
              <span class="trinetra-latency">${latencyText}</span>
              <div class="trinetra-close">✕</div>
            </div>
          </div>

          <!-- CONFIDENCE GAUGE -->
          <div class="trinetra-gauge-container">
            <svg class="trinetra-gauge-svg" viewBox="0 0 200 120">
              <defs>
                <filter id="trinetra-gauge-glow">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <path class="trinetra-gauge-track"
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    />
              <path class="trinetra-gauge-fill"
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    stroke="${gaugeColor}"
                    stroke-dasharray="${gaugeCircumference}"
                    stroke-dashoffset="${gaugeCircumference}"
                    data-target-offset="${gaugeDashoffset}"
                    filter="url(#trinetra-gauge-glow)"
                    />
              <text class="trinetra-gauge-value" x="100" y="78">${confidence.toFixed(1)}</text>
              <text class="trinetra-gauge-unit" x="100" y="96">CONFIDENCE</text>
            </svg>
          </div>

          <!-- VERDICT -->
          <div class="trinetra-verdict-main ${statusClass}">
            <div class="trinetra-yantra-tl"></div>
            <div class="trinetra-yantra-tr"></div>
            <div class="trinetra-yantra-bl"></div>
            <div class="trinetra-yantra-br"></div>
            <div class="trinetra-verdict-label">${data.primary_verdict}</div>
            <div class="trinetra-verdict-sub">CONSOLIDATED FORENSIC VERDICT</div>
            <div class="trinetra-verdict-hindi">${hindiVerdict}</div>
          </div>

          <!-- FACE + GRADCAM -->
          <div class="trinetra-visuals-row ${parentStatusClass}">
            <div class="trinetra-visual-card">
              <div class="trinetra-visual-card-label">Source Extraction</div>
              <div class="trinetra-face-crop-wrap">${faceCropHtml}</div>
            </div>
            <div class="trinetra-visual-card">
              <div class="trinetra-visual-card-label">Grad-CAM Heatmap</div>
              ${gradcamHtml}
            </div>
          </div>

          <!-- STATS -->
          <div class="trinetra-results-grid">
            <div class="trinetra-result-cell">
              <span class="trinetra-label">LOCAL MODEL ⬥ HYBRID</span>
              <span class="trinetra-value ${localTextClass}">${data.local_label} (${data.local_confidence.toFixed(1)}%)</span>
            </div>
            ${rdHtml}
          </div>

          <!-- SUMMARY -->
          <div class="trinetra-summary">${data.forensic_summary}</div>

          <!-- ACTIONS -->
          <div class="trinetra-actions">
            <button class="trinetra-btn" id="trinetra-copy-btn">
              <span class="trinetra-btn-icon">📋</span> Copy Report
            </button>
            <button class="trinetra-btn" id="trinetra-history-btn">
              <span class="trinetra-btn-icon">📜</span> History
            </button>
            <div class="trinetra-actions-spacer"></div>
          </div>

          <!-- FOOTER -->
          <div class="trinetra-footer">
            <div class="trinetra-footer-source">
              <span class="trinetra-footer-source-dot ${sourceDot}"></span>
              ${sourceText}
            </div>
            <div class="trinetra-footer-esc">Esc to close</div>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // ── Animate gauge on next frame ──
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const gaugeFill = modal.querySelector('.trinetra-gauge-fill');
        if (gaugeFill) {
          gaugeFill.style.strokeDashoffset = gaugeFill.getAttribute('data-target-offset');
        }
      });
    });

    // ── Event listeners ──
    modal.querySelector('.trinetra-close').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    // Escape to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        window.removeEventListener('keydown', escHandler);
      }
    };
    window.addEventListener('keydown', escHandler);

    // Copy button
    const copyBtn = modal.querySelector('#trinetra-copy-btn');
    if (copyBtn) {
      copyBtn.onclick = () => copyReport(data, copyBtn);
    }

    // History button
    const historyBtn = modal.querySelector('#trinetra-history-btn');
    if (historyBtn) {
      historyBtn.onclick = () => toggleHistoryDrawer();
    }
  }


  // ==========================================================
  //  §8  ERROR MODAL
  // ==========================================================

  function showErrorModal(title, message) {
    dismissToast();

    const modal = document.createElement('div');
    modal.className = 'trinetra-modal';

    modal.innerHTML = `
      <div class="trinetra-modal-content">
        <div class="trinetra-modal-inner">
          <div class="trinetra-header">
            <div class="trinetra-brand-group">
              <span class="trinetra-brand">TRINETRA <span>// V2</span></span>
              <span class="trinetra-hindi-sub">त्रिनेत्र — सत्य का तीसरा नेत्र</span>
            </div>
            <div class="trinetra-header-right">
              <div class="trinetra-close">✕</div>
            </div>
          </div>

          <div class="trinetra-error-panel">
            <div class="trinetra-error-icon">⚠️</div>
            <div class="trinetra-error-title">${title}</div>
            <div class="trinetra-error-msg">${message}</div>
            ${_lastBase64 ? '<button class="trinetra-btn retry-btn" id="trinetra-retry-btn"><span class="trinetra-btn-icon">🔄</span> Retry Analysis</button>' : ''}
          </div>

          <div class="trinetra-footer">
            <div class="trinetra-footer-source">
              <span class="trinetra-footer-source-dot offline"></span>
              TRINETRA LOCAL ENGINE
            </div>
            <div class="trinetra-footer-esc">Esc to close</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.trinetra-close').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    const escHandler = (e) => {
      if (e.key === 'Escape') { modal.remove(); window.removeEventListener('keydown', escHandler); }
    };
    window.addEventListener('keydown', escHandler);

    // Retry
    const retryBtn = modal.querySelector('#trinetra-retry-btn');
    if (retryBtn && _lastBase64) {
      retryBtn.onclick = () => {
        modal.remove();
        analyzeImage(_lastBase64);
      };
    }
  }


  // ==========================================================
  //  §9  COPY REPORT
  // ==========================================================

  function copyReport(data, btn) {
    const report = [
      `═══ TRINETRA V2 — FORENSIC REPORT ═══`,
      ``,
      `Verdict   : ${data.primary_verdict}`,
      `Confidence: ${data.confidence_score.toFixed(1)}%`,
      `Local AI  : ${data.local_label} (${data.local_confidence.toFixed(1)}%)`,
      `RD Cloud  : ${data.rd_status || 'DISABLED'}${data.rd_score ? ' (' + (data.rd_score * 100).toFixed(1) + '%)' : ''}`,
      `Latency   : ${data.latency_ms.toFixed(0)}ms`,
      ``,
      `Summary:`,
      data.forensic_summary,
      ``,
      `── Generated by Trinetra Extension v2 ──`,
      `   ${new Date().toLocaleString()}`
    ].join('\n');

    navigator.clipboard.writeText(report).then(() => {
      btn.classList.add('success');
      const origHtml = btn.innerHTML;
      btn.innerHTML = `<span class="trinetra-btn-icon">✓</span> Copied!`;
      setTimeout(() => {
        btn.classList.remove('success');
        btn.innerHTML = origHtml;
      }, 2000);
    }).catch(() => {
      showToast("❌ Copy failed", "error");
    });
  }


  // ==========================================================
  //  §10  SCAN HISTORY
  // ==========================================================

  function saveToHistory(data) {
    if (!chrome.storage || !chrome.storage.local) return;

    const entry = {
      timestamp: Date.now(),
      date: new Date().toLocaleString(),
      verdict: data.primary_verdict,
      confidence: data.confidence_score,
      local_label: data.local_label,
      local_confidence: data.local_confidence,
      rd_status: data.rd_status || 'DISABLED',
      latency_ms: data.latency_ms,
      url: window.location.hostname
    };

    chrome.storage.local.get([HISTORY_KEY], (result) => {
      let history = result[HISTORY_KEY] || [];
      history.unshift(entry);
      if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
      chrome.storage.local.set({ [HISTORY_KEY]: history });
    });
  }

  function toggleHistoryDrawer() {
    if (historyDrawer) {
      historyDrawer.classList.remove('open');
      setTimeout(() => { historyDrawer.remove(); historyDrawer = null; }, 500);
      return;
    }

    historyDrawer = document.createElement('div');
    historyDrawer.className = 'trinetra-history-drawer';

    historyDrawer.innerHTML = `
      <div class="trinetra-history-header">
        <span class="trinetra-history-title">Scan History</span>
        <div class="trinetra-history-close">✕</div>
      </div>
      <div class="trinetra-history-list" id="trinetra-history-list">
        <div class="trinetra-history-empty">Loading...</div>
      </div>
    `;

    document.body.appendChild(historyDrawer);
    requestAnimationFrame(() => historyDrawer.classList.add('open'));

    historyDrawer.querySelector('.trinetra-history-close').onclick = () => {
      historyDrawer.classList.remove('open');
      setTimeout(() => { if (historyDrawer) { historyDrawer.remove(); historyDrawer = null; } }, 500);
    };

    // Load history
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([HISTORY_KEY], (result) => {
        const history = result[HISTORY_KEY] || [];
        const listEl = document.getElementById('trinetra-history-list');
        if (!listEl) return;

        if (history.length === 0) {
          listEl.innerHTML = '<div class="trinetra-history-empty">No scans yet.<br/>Analyze an image to see results here.</div>';
          return;
        }

        listEl.innerHTML = history.map(h => {
          const isFake = h.verdict === 'FAKE';
          const dotClass = isFake ? 'fake' : 'real';
          const confColor = isFake ? 'var(--fake-color)' : 'var(--real-color)';
          return `
            <div class="trinetra-history-item">
              <div class="trinetra-history-verdict-dot ${dotClass}"></div>
              <div class="trinetra-history-info">
                <div class="trinetra-history-info-verdict">${h.verdict}</div>
                <div class="trinetra-history-info-meta">${h.url} · ${h.date}</div>
              </div>
              <div class="trinetra-history-confidence" style="color:${confColor}">${h.confidence.toFixed(1)}%</div>
            </div>`;
        }).join('');
      });
    } else {
      const listEl = document.getElementById('trinetra-history-list');
      if (listEl) listEl.innerHTML = '<div class="trinetra-history-empty">Storage unavailable</div>';
    }
  }

})();
