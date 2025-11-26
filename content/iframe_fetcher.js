// iframe_fetcher.js
(function() {
    const send = (type, payload) =>
        window.LemurDevToolsPort.send(type, payload);

    function inspectIframes() {
        const frames = document.querySelectorAll("iframe");

        frames.forEach((frame, index) => {
            try {
                // Try same-origin access
                const doc = frame.contentDocument;
                if (doc) {
                    send("iframe_content", {
                        index,
                        src: frame.src,
                        html: doc.documentElement.outerHTML
                    });
                } else {
                    throw "Cross-origin frame";
                }
            } catch (e) {
                // Fallback: fetch via extension proxy
                chrome.runtime.sendMessage({
                    type: "fetch_iframe",
                    url: frame.src,
                    index
                });
            }
        });
    }

    // Run once at start and again when iframes appear
    const iframeObserver = new MutationObserver(inspectIframes);

    iframeObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Initial scan
    inspectIframes();
})();
