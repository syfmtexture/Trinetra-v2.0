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
  console.log("Trinetra Icon Clicked on Tab:", tab.id);
  if (tab.url.startsWith("chrome://") || tab.url.startsWith("https://chrome.google.com/webstore")) {
    console.error("Trinetra cannot run on Chrome system pages.");
    return;
  }

  try {
    // 1. Try sending message to existing content script
    await chrome.tabs.sendMessage(tab.id, { action: "open-panel" });
    console.log("Panel opened via existing content script.");
  } catch (error) {
    // 2. If it fails, inject scripts (may happen if content script isn't running or page just loaded)
    console.log("Content script not responding, attempting injection...");
    try {
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["content.css"]
      });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
      
      // 3. Small delay to allow content.js to register its listener
      setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, { action: "open-panel" })
          .then(() => console.log("Panel opened after injection."))
          .catch(err => console.error("Final messaging attempt failed:", err));
      }, 250);
    } catch (injectError) {
      console.error("Critical failure during Trinetra injection/messaging:", injectError);
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
