// GOOGLE-WEB=SPEECH-API-RECOGNTION (COSTUMIZED)
function GoogleWebSpeechAPIRecognition() {
    
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;

    recognition.lang = "de-De";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // ONRESULT
    recognition.onresult = (event) => {
        clearTimeout(recognitionTimeout);
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript + " ";
        }
    
        intermediateTranscript = transcript;
        intermediateprocessed = intermediateTranscript.slice(prevLength); // Slice proper
        insertedswearwords = replaceSwearWords(intermediateprocessed); // Swearword detection
        resultDiv.textContent = insertedswearwords.charAt(0).toUpperCase() + insertedswearwords.slice(1);

        clearTimeout(recognitionTimeout);
    
        recognitionTimeout = setTimeout(() => {
            const newSentence = intermediateTranscript.slice(prevLength);
    
            // INSERT INTO DIVELEMENT
            prevLength = intermediateTranscript.length;
            intermediateTranscript = "";

            grammared = Grammar(newSentence)
            resultDiv.textContent = grammared.charAt(0).toUpperCase() + grammared.slice(1);
            insertTextAtCursor(grammared);
        }, 500);
    };
    // ONEND
    recognition.onend = () => {
        clearTimeout(recognitionTimeout);

        // CLEAN TRANSCRIPT
        finalTranscript = intermediateTranscript;
        insertTextAtCursor(finalTranscript);

        recognitionTimeout = setTimeout(() => {
            prevLength = 0; // Reset the length for new session
            intermediateTranscript = "";
            resultDiv.textContent = "";
        }, 500);
    };
}
