// inject.js
// Bootstraps all other content scripts into the webpage environment

(function() {
    // Utility: load a script into the page context
    function injectScript(file) {
        const s = document.createElement('script');
        s.src = chrome.runtime.getURL(file);
        s.onload = () => s.remove();
        (document.head || document.documentElement).appendChild(s);
    }

    // Initialize message bridge back to extension
    window.LemurDevToolsPort = {
        send(type, payload) {
            chrome.runtime.sendMessage({ type, payload });
        }
    };

    // Inject runtime tools
    injectScript('content/dom_inspector.js');
    injectScript('content/obfuscation_monitor.js');
    injectScript('content/iframe_fetcher.js');

    // Confirm content scripts loaded
    chrome.runtime.sendMessage({ type: "inject_loaded", url: window.location.href });
})();
