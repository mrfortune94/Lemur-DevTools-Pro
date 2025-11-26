// dom_inspector.js
(function() {
    const send = (type, data) => {
        window.LemurDevToolsPort.send(type, data);
    };

    // Send full DOM snapshot
    function sendDomSnapshot() {
        send("dom_snapshot", {
            html: document.documentElement.outerHTML,
            url: window.location.href,
            timestamp: Date.now()
        });
    }

    // Observe DOM changes
    const observer = new MutationObserver(muts => {
        send("dom_mutation", {
            count: muts.length,
            summary: muts.map(m => ({
                type: m.type,
                node: m.target?.nodeName,
                added: m.addedNodes?.length || 0,
                removed: m.removedNodes?.length || 0
            }))
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    // Initial snapshot
    sendDomSnapshot();

    // Also send DOM snapshot after page fully loads
    window.addEventListener('load', () => {
        setTimeout(sendDomSnapshot, 500);
    });
})();
