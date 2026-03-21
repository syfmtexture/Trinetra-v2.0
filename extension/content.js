/**
 * content.js — Region Selection & UI for Trinetra
 * 
 * Provides:
 *   - Transparent overlay selection layer
 *   - Drag-to-select functionality
 *   - Image cropping via Canvas
 *   - Local API communication
 *   - Premium result UI (Overview + Settings)
 */

(function () {
  if (window._trinetraInitialized) {
    console.log("Trinetra already initialized on this page.");
    return;
  }
  window._trinetraInitialized = true;
  console.log("Trinetra Content Script Initialized.");

  let selectionBox = null;
  let startX, startY;
  let isSelecting = false;
  let overlay = null;
  let activeAnalysisController = null;

  // Settings State
  let settings = {
    useLocal: true,
    useCloud: true
  };

  // Initialize Settings from Storage
  chrome.storage.local.get(['useLocal', 'useCloud'], (result) => {
    if (result.useLocal !== undefined) settings.useLocal = result.useLocal;
    if (result.useCloud !== undefined) settings.useCloud = result.useCloud;
    
    // Safety check: at least one must be true
    if (!settings.useLocal && !settings.useCloud) {
       settings.useLocal = true;
       chrome.storage.local.set({ useLocal: true });
    }
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Trinetra Message Received:", request.action);
    if (request.action === "open-panel") {
      showWidget();
    } else if (request.action === "scan-audio-src") {
      handleAudioScan(request.url);
    }
  });

  function handleAudioScan(url) {
    showToast("🎵 Fetching audio data...", "loading");
    fetch(url)
      .then(r => r.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          analyzeAudio(reader.result);
        };
        reader.readAsDataURL(blob);
      })
      .catch(err => {
        showToast("❌ Failed to fetch audio source.", "error");
        console.error("Audio fetch error:", err);
      });
  }

  function activateSelectionMode() {
    if (overlay) return;
    
    // Hide widget while selecting
    const widget = document.getElementById('trinetra-widget-container');
    if (widget) widget.style.display = 'none';

    overlay = document.createElement('div');
    overlay.className = 'trinetra-selection-overlay';
    
    // Add Terminate button to overlay
    const terminateBtn = document.createElement('button');
    terminateBtn.className = 'trinetra-terminate-overlay-btn';
    terminateBtn.innerHTML = 'Cancel Scan (Esc)';
    terminateBtn.onclick = (e) => {
        e.stopPropagation();
        cancelSelection({ key: 'Escape' });
    };
    overlay.appendChild(terminateBtn);

    document.body.appendChild(overlay);

    overlay.addEventListener('mousedown', startSelection);
    overlay.addEventListener('mousemove', updateSelection);
    overlay.addEventListener('mouseup', finishSelection);

    // Add escape listener to cancel
    window.addEventListener('keydown', cancelSelection);
  }

  function cancelSelection(e) {
    if (e.key === 'Escape') {
      const widget = document.getElementById('trinetra-widget-container');
      if (widget) widget.style.display = 'block';
      cleanup();
      showToast("Scan Cancelled", "info");
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
    if (e.target.className === 'trinetra-terminate-overlay-btn') return;
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
      const widget = document.getElementById('trinetra-widget-container');
      if (widget) widget.style.display = 'block';
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
        const widget = document.getElementById('trinetra-widget-container');
        if (widget) widget.style.display = 'block';
      }
    });
  }

  function processScreenshot(dataUrl, rect) {
    const img = new Image();
    img.onload = function () {
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

  function analyzeAudio(base64Data) {
    showToast("🔬 Running Audio Forensic Triage...", "loading");
    
    if (activeAnalysisController) activeAnalysisController.abort();
    activeAnalysisController = new AbortController();

    fetch("http://localhost:8000/analyze-audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
          base64_data: base64Data,
          use_local: settings.useLocal,
          use_cloud: settings.useCloud
      }),
      signal: activeAnalysisController.signal
    })
      .then(r => r.json())
      .then(data => {
        showResultPopup(data, true);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        showToast("🔴 API Offline. Ensure Trinetra server is running.", "error");
        console.error("Trinetra Audio API error:", err);
      });
  }

  function analyzeImage(base64Data) {
    showToast("🔬 Running Forensic Triage...", "loading");
    
    // Show loading in overview tab
    const overviewContent = document.getElementById('trinetra-tab-overview');
    if (overviewContent) {
        overviewContent.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <div class="trinetra-loader"></div>
                <div style="margin-top: 15px; font-weight: 500; font-size: 14px; color: var(--text-secondary);">Analyzing regional artifacts...</div>
                <button id="trinetra-abort-btn" class="trinetra-terminate-btn" style="margin-top: 20px;">Terminate Scan</button>
            </div>
        `;
        overviewContent.querySelector('#trinetra-abort-btn').onclick = () => {
            if (activeAnalysisController) activeAnalysisController.abort();
            showWidget(); // Reset to home state
            showToast("Scan Terminated", "info");
        };
    }

    if (activeAnalysisController) activeAnalysisController.abort();
    activeAnalysisController = new AbortController();

    fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
          base64_data: base64Data,
          use_local: settings.useLocal,
          use_cloud: settings.useCloud
      }),
      signal: activeAnalysisController.signal
    })
      .then(r => r.json())
      .then(data => {
        showResultPopup(data);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        showToast("🔴 API Offline. Ensure Trinetra server is running.", "error");
        console.error("Trinetra API error:", err);
        showWidget(); // Reset to home
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

  function showWidget() {
    console.log("Showing Trinetra Widget...");
    const oldWidget = document.getElementById('trinetra-widget-container');
    if (oldWidget) {
        oldWidget.style.display = 'block';
        oldWidget.style.opacity = '1';
        switchTab('overview');
        return;
    }

    const widget = document.createElement('div');
    widget.id = 'trinetra-widget-container';
    widget.className = 'trinetra-widget';
    
    updateWidgetUI(widget);
    document.body.appendChild(widget);
    setupWidgetEvents(widget);
    
    // Explicit close handler
    const closeBtn = widget.querySelector('#trinetra-widget-close');
    if (closeBtn) {
        closeBtn.onclick = () => {
             widget.style.display = 'none';
        };
    }

    switchTab('overview');
  }

  function updateWidgetUI(widget, resultData = null, isAudio = false) {
    const logoUrl = chrome.runtime.getURL("icons/logo.png");
    
    widget.innerHTML = `
        <div class="trinetra-widget-header" id="trinetra-widget-header">
           <div class="trinetra-widget-title">
               <img class="trinetra-logo" src="${logoUrl}" alt="Trinetra">
               TRINETRA
           </div>
           <div class="trinetra-widget-close" id="trinetra-widget-close">&times;</div>
        </div>
        <div class="trinetra-widget-tabs">
            <div class="trinetra-tab" data-tab="overview">Overview</div>
            <div class="trinetra-tab" data-tab="settings">Settings</div>
        </div>
        <div class="trinetra-tab-content active" id="trinetra-tab-overview"></div>
        <div class="trinetra-tab-content" id="trinetra-tab-settings"></div>
        <div class="trinetra-widget-footer">
            <img src="${logoUrl}" alt="">
            <span>Powered by Trinetra Forensic Engine</span>
        </div>
    `;

    renderOverview(widget, resultData, isAudio);
    renderSettings(widget);
  }

  function renderOverview(widget, data = null, isAudio = false) {
    const container = widget.querySelector('#trinetra-tab-overview');
    const logoUrl = chrome.runtime.getURL("icons/logo.png");
    const scanUrl = chrome.runtime.getURL("icons/scan.png");

    if (!data) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <img src="${logoUrl}" style="width: 64px; height: 64px; margin-bottom: 20px; opacity: 0.9;">
                <h3 style="margin: 0 0 10px; font-weight: 700; font-size: 18px;">Forensic Analyzer</h3>
                <p style="margin: 0 0 25px; font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
                    Select any region on the screen to perform a consolidated deepfake audit.
                </p>
                <button id="trinetra-start-scan" class="trinetra-scan-btn">
                   <img src="${scanUrl}" style="width: 16px; height: 16px; margin-right: 8px;">
                   Start Area Scan
                </button>
            </div>
        `;
        container.querySelector('#trinetra-start-scan').onclick = activateSelectionMode;
        return;
    }

    const isFake = data.primary_verdict === "FAKE";
    const statusClass = isFake ? "status-fake" : "status-real";
    const confidence = data.confidence_score || 0;
    const barFillClass = isFake ? "fill-fake" : "fill-real";
    const sirenUrl = chrome.runtime.getURL("icons/siren.png");
    const shieldUrl = chrome.runtime.getURL("icons/shield.png");
    const verdictIcon = isFake ? sirenUrl : shieldUrl;

    let rdHtml = '';
    if (data.rd_status && data.rd_status !== "DISABLED" && data.rd_status !== "ERROR") {
      const isRdFake = ["FAKE", "MANIPULATED", "SUSPICIOUS"].includes(data.rd_status);
      const rdTextClass = isRdFake ? "fake-text" : "real-text";
      const rdScoreText = data.rd_score ? `(${(data.rd_score * 100).toFixed(1)}%)` : '';
      rdHtml = `
         <div class="trinetra-detail-row">
            <span class="trinetra-detail-label"><img src="${scanUrl}" alt="">Cloud Analysis</span>
            <span class="trinetra-detail-value ${rdTextClass}">${data.rd_status} ${rdScoreText}</span>
         </div>
       `;
    } else {
      rdHtml = `
         <div class="trinetra-detail-row">
            <span class="trinetra-detail-label"><img src="${scanUrl}" alt="">Cloud Analysis</span>
            <span class="trinetra-detail-value ${data.rd_status === "DISABLED" ? "" : "unavailable"}" style="font-style: italic;">
               ${data.rd_status === "DISABLED" ? "Disabled" : "Unavailable"}
            </span>
         </div>
       `;
    }

    const localTextClass = data.local_label === "FAKE" ? "fake-text" : "real-text";
    const localDisplay = isAudio ? "N/A (Cloud Only)" : `${data.local_label} (${data.local_confidence.toFixed(1)}%)`;
    const localClass = isAudio ? "" : localTextClass;
    const localValueHtml = data.local_label === "DISABLED" ? "Disabled" : localDisplay;

    container.innerHTML = `
        <div class="trinetra-widget-body">
            <div class="trinetra-verdict-box ${statusClass}">
               <img class="trinetra-verdict-icon" src="${verdictIcon}" alt="">
               <div class="trinetra-verdict-label">${data.primary_verdict}</div>
               <div class="trinetra-verdict-sub">Consolidated Forensic Verdict</div>
               <div class="trinetra-confidence-bar-track">
                  <div class="trinetra-confidence-bar-fill ${barFillClass}" style="width: ${confidence}%"></div>
               </div>
            </div>

            <div class="trinetra-details-grid">
                <div class="trinetra-detail-row">
                   <span class="trinetra-detail-label"><img src="${scanUrl}" alt="">Local Model</span>
                   <span class="trinetra-detail-value ${data.local_label === "DISABLED" ? "" : localClass}">${localValueHtml}</span>
                </div>
               ${rdHtml}
               <div class="trinetra-detail-row">
                  <span class="trinetra-detail-label"><img src="${scanUrl}" alt="">Processing Time</span>
                  <span class="trinetra-detail-value">${data.latency_ms}ms</span>
               </div>
            </div>

            <div class="trinetra-summary-text">
               ${data.forensic_summary}
            </div>
            
            <button id="trinetra-rescan" class="trinetra-scan-btn secondary" style="margin-top: 15px; width: 100%;">New Scan</button>
        </div>
    `;
    container.querySelector('#trinetra-rescan').onclick = activateSelectionMode;
  }

  function renderSettings(widget) {
    const container = widget.querySelector('#trinetra-tab-settings');
    container.innerHTML = `
        <div class="trinetra-settings-panel">
            <div class="trinetra-settings-group">
                <div class="trinetra-setting-item">
                    <div class="trinetra-setting-info">
                        <div class="trinetra-setting-title">Local Model Analysis</div>
                        <div class="trinetra-setting-desc">Perform image audit using your local hardware.</div>
                    </div>
                    <label class="trinetra-switch">
                        <input type="checkbox" id="trinetra-toggle-local" ${settings.useLocal ? 'checked' : ''}>
                        <span class="trinetra-slider"></span>
                    </label>
                </div>
                
                <div class="trinetra-setting-item">
                    <div class="trinetra-setting-info">
                        <div class="trinetra-setting-title">Cloud API Integration</div>
                        <div class="trinetra-setting-desc">Verified cloud forensics powered by Reality Defender.</div>
                    </div>
                    <label class="trinetra-switch">
                        <input type="checkbox" id="trinetra-toggle-cloud" ${settings.useCloud ? 'checked' : ''}>
                        <span class="trinetra-slider"></span>
                    </label>
                </div>
            </div>
            
            <div id="settings-warning" style="color: var(--fake-color); font-size: 11px; margin-top: 10px; font-weight: 600; text-align: center; display: none;">
                ⚠️ At least one analysis engine must be active.
            </div>

            <div style="margin-top: 30px; font-size: 11px; color: var(--text-tertiary); line-height: 1.4;">
                <p><b>Note:</b> Audio scanning always requires Cloud API even if Local Model is on.</p>
            </div>
        </div>
    `;

    const localToggle = container.querySelector('#trinetra-toggle-local');
    const cloudToggle = container.querySelector('#trinetra-toggle-cloud');
    const warning = container.querySelector('#settings-warning');

    const updateToggles = () => {
        if (!localToggle.checked && !cloudToggle.checked) {
            // Revert last check
            if (settings.useLocal) cloudToggle.checked = true;
            else localToggle.checked = true;
            warning.style.display = 'block';
            setTimeout(() => { warning.style.display = 'none'; }, 3000);
            return;
        }
        settings.useLocal = localToggle.checked;
        settings.useCloud = cloudToggle.checked;
        chrome.storage.local.set({ useLocal: settings.useLocal, useCloud: settings.useCloud });
    };

    localToggle.onchange = updateToggles;
    cloudToggle.onchange = updateToggles;
  }

  function setupWidgetEvents(widget) {
    // Close Button
    widget.querySelector('#trinetra-widget-close').onclick = () => widget.remove();

    // Tabs
    widget.querySelectorAll('.trinetra-tab').forEach(tab => {
        tab.onclick = () => switchTab(tab.dataset.tab);
    });

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

  function switchTab(tabId) {
    const widget = document.getElementById('trinetra-widget-container');
    if (!widget) return;

    widget.querySelectorAll('.trinetra-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tabId);
    });
    widget.querySelectorAll('.trinetra-tab-content').forEach(c => {
        c.classList.toggle('active', c.id === `trinetra-tab-${tabId}`);
    });
  }

  function showResultPopup(data, isAudio = false) {
    const toast = document.getElementById('trinetra-toast');
    if (toast) toast.classList.remove('show');

    let widget = document.getElementById('trinetra-widget-container');
    if (!widget) {
        showWidget();
        widget = document.getElementById('trinetra-widget-container');
    }
    
    // Explicitly make visible
    widget.style.display = 'block';
    widget.style.opacity = '1';
    
    updateWidgetUI(widget, data, isAudio);
    setupWidgetEvents(widget);
    switchTab('overview');
  }

})();
