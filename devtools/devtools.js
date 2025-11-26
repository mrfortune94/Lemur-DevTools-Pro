// devtools.js

const domOut = document.getElementById("domOutput");
const mutOut = document.getElementById("mutationOutput");
const netOut = document.getElementById("networkOutput");
const runOut = document.getElementById("runtimeOutput");
const iframeOut = document.getElementById("iframeOutput");
const clearBtn = document.getElementById("clearLogs");

clearBtn.onclick = () => {
    domOut.textContent = "";
    mutOut.textContent = "";
    netOut.textContent = "";
    runOut.textContent = "";
    iframeOut.textContent = "";
};

// Listen for messages FROM background/content scripts
chrome.runtime.onMessage.addListener((msg) => {
    switch (msg.type) {

        case "dom_snapshot":
            domOut.textContent =
                `URL: ${msg.payload.url}\nTimestamp: ${msg.payload.timestamp}\n\n` +
                msg.payload.html;
            break;

        case "dom_mutation":
            mutOut.textContent +=
                `Mutations (${msg.payload.count})\n` +
                JSON.stringify(msg.payload.summary, null, 2) +
                "\n-----------------------------\n";
            break;

        case "network_event":
            netOut.textContent += JSON.stringify(msg.data, null, 2) +
                "\n-----------------------------\n";
            break;

        case "eval_called":
            runOut.textContent +=
                "[eval()] Called:\n" +
                msg.payload.snippet +
                "\n-----------------------------\n";
            break;

        case "function_constructor":
            runOut.textContent +=
                "[Function Constructor]\nArgs: " +
                JSON.stringify(msg.payload.argsPreview, null, 2) +
                "\n-----------------------------\n";
            break;

        case "innerhtml_modified":
            runOut.textContent +=
                `[innerHTML Modified on <${msg.payload.tag}>]\n` +
                msg.payload.snippet +
                "\n-----------------------------\n";
            break;

        case "iframe_content":
            iframeOut.textContent +=
                `IFRAME #${msg.payload.index}\nSRC: ${msg.payload.src}\n\n` +
                msg.payload.html +
                "\n-----------------------------\n";
            break;

    }
});
