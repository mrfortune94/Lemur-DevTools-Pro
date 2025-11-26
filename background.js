// GLOBAL STATE
let DEVTOOLS_ENABLED = false;

// Handle messages from popup (settings page)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "toggle_devtools") {
        DEVTOOLS_ENABLED = msg.enabled;
        sendResponse({ ok: true, DEVTOOLS_ENABLED });
    }
});

// CORS REWRITE PROXY  (safe: only active when devtools enabled)
chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
        if (!DEVTOOLS_ENABLED) return {};

        let headers = details.responseHeaders || [];

        headers.push({ name: "Access-Control-Allow-Origin", value: "*" });
        headers.push({ name: "Access-Control-Allow-Credentials", value: "true" });
        headers.push({ name: "Access-Control-Allow-Headers", value: "*" });
        headers.push({ name: "Access-Control-Allow-Methods", value: "*" });

        return { responseHeaders: headers };
    },
    { urls: ["<all_urls>"] },
    ["blocking", "responseHeaders"]
);

// Network event logger
chrome.webRequest.onCompleted.addListener(
    (info) => {
        if (!DEVTOOLS_ENABLED) return;
        chrome.runtime.sendMessage({ type: "network_event", data: info });
    },
    { urls: ["<all_urls>"] }
);
