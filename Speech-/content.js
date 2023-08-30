const script = document.createElement('script');
script.setAttribute('type', 'module');
script.src = chrome.runtime.getURL('content-script-module.js');
document.head.appendChild(script);

let activeElement;
let recognition;
let resultDiv; // Separate div to display intermediate and final results
let recognitionTimeout; // Track the timeout for recognizing the final result
let intermediateTranscript = ""; // Store intermediate transcript
let finalTranscript = ""; // Store final transcript
let sentences = []; // Store spoken sentenceslet recognition;
let prevLength = 0; // Length of the previously spoken text
let shouldCapitalizeNextSentence = false

// SPEECH BUTTON
const button = document.createElement("button");
button.id = "speechToTextButton";
button.textContent = "🎤";
button.style.position = "fixed";
button.style.bottom = "20px";
button.style.right = "20px";
button.style.zIndex = "10000";
button.style.background = "#000";
button.style.color = "#fff";
button.style.border = "none";
button.style.borderRadius = "50%";
button.style.width = "50px";
button.style.height = "50px";
button.style.fontSize = "24px";
button.style.cursor = "pointer";
document.body.appendChild(button);

// LIVE-TRANSCRIPTION-DIV
resultDiv = document.createElement("div");
resultDiv.id = "resultDiv"; // Assign an ID for easier reference
resultDiv.style.position = "fixed";
resultDiv.style.left = "50%"; // Position in the middle horizontally
resultDiv.style.transform = "translateX(-50%)"; // Center the div
resultDiv.style.bottom = "120px"; // Move up a bit from the bottom // ORIGNAL: 60px
resultDiv.style.background = "#ddd";
resultDiv.style.color = "#000"; // Black text color
resultDiv.style.padding = "15px"; // Adjust padding for larger size
resultDiv.style.borderRadius = "10px"; // Adjust border radius for larger size
resultDiv.style.fontSize = "18px"; // Adjust font size for better readability
resultDiv.style.display = "none"; // Start hidden
resultDiv.style.zIndex = "9999"; // Set a high z-index value to make it appear above other elements
document.body.appendChild(resultDiv);

function Initiate() {
    if (!recognition) {
        GoogleWebSpeechAPIRecognition()
    }
    if (!recognition.manualStop) {
        recognition.manualStop = true;
        recognition.stop();
        button.style.background = "#000";
        resultDiv.style.display = "none"; // Hide result display
    } else {
        recognition.manualStop = false;
        recognition.start();
        button.style.background = "#6495ED";
        resultDiv.style.display = "block"; // Show result display
    }
}

button.addEventListener("mousedown", (event) => {
    activeElement = document.activeElement;
    Initiate();
});
