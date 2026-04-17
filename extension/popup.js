/**
 * popup.js — Trinetra Extension Popup Logic
 * 
 * Handles:
 *  - Toggle state persistence (chrome.storage.local)
 *  - At-least-one-on enforcement
 *  - Scan trigger → background → content script
 *  - Server health check
 */

const switchLocal = document.getElementById('switch-local');
const switchCloud = document.getElementById('switch-cloud');
const btnScan    = document.getElementById('btn-scan');
const warning    = document.getElementById('tri-warning');
const statusDot  = document.querySelector('.tri-status-dot');
const statusText = document.querySelector('.tri-status-text');

// ── Load saved toggle state ──
chrome.storage.local.get(['useLocal', 'useCloud'], (data) => {
  // Default both ON if no saved state
  switchLocal.checked = data.useLocal !== undefined ? data.useLocal : true;
  switchCloud.checked = data.useCloud !== undefined ? data.useCloud : true;
});

// ── Toggle handlers with at-least-one enforcement ──
switchLocal.addEventListener('change', () => {
  if (!switchLocal.checked && !switchCloud.checked) {
    switchLocal.checked = true;
    flashWarning();
    return;
  }
  saveSettings();
});

switchCloud.addEventListener('change', () => {
  if (!switchLocal.checked && !switchCloud.checked) {
    switchCloud.checked = true;
    flashWarning();
    return;
  }
  saveSettings();
});

function saveSettings() {
  warning.classList.remove('visible');
  chrome.storage.local.set({
    useLocal: switchLocal.checked,
    useCloud: switchCloud.checked
  });
}

function flashWarning() {
  warning.classList.remove('visible');
  // Force reflow for re-triggering animation
  void warning.offsetWidth;
  warning.classList.add('visible');
  setTimeout(() => warning.classList.remove('visible'), 3000);
}

// ── Scan button ──
btnScan.addEventListener('click', async () => {
  // Save settings first
  saveSettings();
  
  // Get the current active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !tab.id) {
    return;
  }

  // Send message to background to start the scan
  chrome.runtime.sendMessage({
    action: "start-scan",
    tabId: tab.id
  });

  // Close the popup
  window.close();
});

// ── Server health check ──
async function checkServerStatus() {
  try {
    const response = await fetch('http://localhost:8000/', {
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      statusDot.className = 'tri-status-dot online';
      statusText.textContent = 'Server Online';
    } else {
      setOffline();
    }
  } catch (e) {
    setOffline();
  }
}

function setOffline() {
  statusDot.className = 'tri-status-dot offline';
  statusText.textContent = 'Server Offline';
}

// Run health check on popup open
checkServerStatus();
