/**
 * background.js — Trinetra Service Worker
 * 
 * Handles:
 *  - Context menu fallback for scan
 *  - "start-scan" message from popup
 *  - Screenshot capture for content script
 */

// ──── Context Menu Setup ────
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "trinetra-scan",
    title: "🔍 Trinetra — Scan Selected Region",
    contexts: ["page", "image"]
  });
  // Initialize default settings
  chrome.storage.local.get(['useLocal', 'useCloud'], (data) => {
    if (data.useLocal === undefined || data.useCloud === undefined) {
      chrome.storage.local.set({ useLocal: true, useCloud: true });
    }
  });
  console.log("Trinetra: Extension installed/updated.");
});

// ──── Context Menu Click ────
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "trinetra-scan") {
    await activateTrinetra(tab);
  }
});

// ──── Message Handler ────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start-scan") {
    // From popup — activate on the specified tab
    chrome.tabs.get(request.tabId, async (tab) => {
      await activateTrinetra(tab);
    });
    sendResponse({ status: "ok" });
    return true;
  }

  if (request.action === "capture-screenshot") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      sendResponse({ dataUrl: dataUrl });
    });
    return true;
  }
});

// ──── Core Activation Logic ────
async function activateTrinetra(tab) {
  if (!tab || !tab.id) {
    console.error("Trinetra: No valid tab.");
    return;
  }

  const url = tab.url || "";
  if (
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("https://chrome.google.com/webstore") ||
    url.startsWith("edge://") ||
    url.startsWith("about:")
  ) {
    console.warn("Trinetra: Cannot run on this page:", url);
    return;
  }

  // Try messaging the existing content script
  try {
    await chrome.tabs.sendMessage(tab.id, { action: "toggle-selection" });
    return;
  } catch (e) {
    console.log("Trinetra: Content script not responding. Injecting...");
  }

  // Inject scripts
  try {
    await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ["content.css"] });
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
  } catch (err) {
    console.error("Trinetra: Script injection failed:", err.message);
    return;
  }

  // Wait then trigger
  await new Promise(r => setTimeout(r, 300));
  try {
    await chrome.tabs.sendMessage(tab.id, { action: "toggle-selection" });
  } catch (e) {
    console.error("Trinetra: Activation failed:", e.message);
  }
}
