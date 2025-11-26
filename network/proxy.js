// proxy.js
// Handles iframe fetching fallback and safe CORS-compatible data retrieval

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.type !== "fetch_iframe") return;

    try {
        const res = await fetch(msg.url, {
            method: "GET",
            mode: "cors",
            credentials: "include"
        });

        const text = await res.text();

        chrome.tabs.sendMessage(sender.tab.id, {
            type: "iframe_content",
            payload: {
                index: msg.index,
                src: msg.url,
                html: text
            }
        });
    }
    catch (err) {
        chrome.tabs.sendMessage(sender.tab.id, {
            type: "iframe_content",
            payload: {
                index: msg.index,
                src: msg.url,
                html: `[ERROR FETCHING IFRAME CONTENT]\n${err}`
            }
        });
    }
});
