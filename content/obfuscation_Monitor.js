// obfuscation_monitor.js
(function() {
    const send = (type, data) => {
        window.LemurDevToolsPort.send(type, data);
    };

    // Hook eval()
    const originalEval = window.eval;
    window.eval = function(str) {
        send("eval_called", {
            snippet: str.substring(0, 300),
            length: str.length
        });
        return originalEval(str);
    };

    // Hook new Function()
    const OriginalFunction = Function;
    window.Function = function(...args) {
        send("function_constructor", {
            argsPreview: args.map(a => String(a).substring(0, 200))
        });
        return OriginalFunction(...args);
    };

    // Hook innerHTML assignments
    const set = Element.prototype.__lookupSetter__("innerHTML");
    const get = Element.prototype.__lookupGetter__("innerHTML");

    Object.defineProperty(Element.prototype, "innerHTML", {
        set(value) {
            send("innerhtml_modified", {
                tag: this.tagName,
                snippet: value.substring(0, 200)
            });
            set.call(this, value);
        },
        get() {
            return get.call(this);
        }
    });
})();
