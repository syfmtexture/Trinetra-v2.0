/**
 * background.js — Handler for Trinetra Extension Actions
 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scan-audio",
    title: "Scan Audio with Trinetra",
    contexts: ["audio", "video"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scan-audio") {
    const src = info.srcUrl;
    if (src) {
      chrome.tabs.sendMessage(tab.id, { action: "scan-audio-src", url: src });
    }
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith("chrome://") || tab.url.startsWith("https://chrome.google.com/webstore")) {
    console.error("Trinetra cannot run on Chrome system pages.");
    return;
  }

  try {
    // Try sending the message first
    await chrome.tabs.sendMessage(tab.id, { action: "toggle-selection" });
  } catch (error) {
    // If it fails, the content script likely isn't injected yet (e.g., page not refreshed)
    console.log("Content script not found, injecting now...");
    try {
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["content.css"]
      });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
      // Give it a tiny bit of time to initialize, then send message again
      setTimeout(async () => {
         await chrome.tabs.sendMessage(tab.id, { action: "toggle-selection" });
      }, 150);
    } catch (injectError) {
      console.error("Failed to inject Trinetra scripts:", injectError);
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "capture-screenshot") {
    // Capture the visible tab and send the data URL back to the content script for cropping
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      sendResponse({ dataUrl: dataUrl });
    });
    return true; // Keep the message channel open for async sendResponse
  }
});
