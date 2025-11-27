// GLOBAL STATE
let DEVTOOLS_ENABLED = false;

// Handle messages from popup (settings page)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "toggle_devtools") {
        DEVTOOLS_ENABLED = msg.enabled;
        sendResponse({ ok: true, DEVTOOLS_ENABLED });
    }
});

// Network event logger (MV3 compatible - no blocking)
chrome.webRequest.onCompleted.addListener(
    (info) => {
        if (!DEVTOOLS_ENABLED) return;
        chrome.runtime.sendMessage({ type: "network_event", data: info });
    },
    { urls: ["<all_urls>"] }
);

// Note: In Manifest V3, header modification requires declarativeNetRequest rules
// The CORS proxy feature is simplified for MV3 compatibility
