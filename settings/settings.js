// settings.js

const toggle = document.getElementById("devtoolsToggle");
const openBtn = document.getElementById("openDevTools");

// Restore toggle state from storage
chrome.storage.local.get(["DEVTOOLS_ENABLED"], (res) => {
    toggle.checked = !!res.DEVTOOLS_ENABLED;
});

// Toggle DevTools mode
toggle.addEventListener("change", () => {
    const enabled = toggle.checked;

    // Save state
    chrome.storage.local.set({ DEVTOOLS_ENABLED: enabled });

    // Notify background script
    chrome.runtime.sendMessage({
        type: "toggle_devtools",
        enabled
    });
});

// Open the DevTools panel (devtools/index.html)
openBtn.addEventListener("click", () => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("devtools/index.html")
    });
});
