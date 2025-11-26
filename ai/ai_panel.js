// ai_panel.js

const output = document.getElementById("output");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");

// Change this to your preferred backend endpoint
let AI_ENDPOINT = null; // e.g., "http://localhost:5000/api/ai"

function appendOutput(text) {
    output.textContent += text + "\n\n";
    output.scrollTop = output.scrollHeight;
}

sendBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    appendOutput("> " + prompt);
    promptInput.value = "";

    if (!AI_ENDPOINT) {
        appendOutput("[AI Helper Not Configured]\nSet an API endpoint in ai_panel.js");
        return;
    }

    try {
        const res = await fetch(AI_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await res.json();
        appendOutput(data.output || "[No response from AI backend]");
    }
    catch (err) {
        appendOutput("[Error contacting AI backend]");
        appendOutput(String(err));
    }
});
