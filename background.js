// GLOBAL STATE
let DEVTOOLS_ENABLED = false;

// Handle messages from popup (settings page)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "toggle_devtools") {
        DEVTOOLS_ENABLED = msg.enabled;
        sendResponse({ ok: true, DEVTOOLS_ENABLED });
    }
    
    // Handle iframe fetching (from proxy.js)
    if (msg.type === "fetch_iframe") {
        fetchIframeContent(msg.url, msg.index, sender.tab.id);
    }
});

// Fetch iframe content (from proxy.js)
async function fetchIframeContent(url, index, tabId) {
    try {
        const res = await fetch(url, {
            method: "GET",
            mode: "cors",
            credentials: "include"
        });

        const text = await res.text();

        chrome.tabs.sendMessage(tabId, {
            type: "iframe_content",
            payload: {
                index,
                src: url,
                html: text
            }
        });
    }
    catch (err) {
        chrome.tabs.sendMessage(tabId, {
            type: "iframe_content",
            payload: {
                index,
                src: url,
                html: `[ERROR FETCHING IFRAME CONTENT]\n${err}`
            }
        });
    }
}

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
