function insertTextAtCursor(text) {
    const el = document.activeElement;
    const tagName = el.tagName.toLowerCase();

    if (tagName === "div" && el.getAttribute("contenteditable") === "true") {
        const newText = el.textContent + text;
        if (newText.length <= 150) {
            el.textContent = newText; // Append the new interim transcript to the existing content
        }
    } else if (tagName === "input" || tagName === "textarea") {
        // Only insert the final transcript into the active input field
        if (!recognition.manualStop && text.trim() !== "") { // Check if text is non-empty
            const limitedText = text.substring(0, 150); // Limit text to 150 characters
            el.value = limitedText; // Replace the entire content with the new final transcript
            const inputEvent = new Event("input", { bubbles: true, cancelable: true });
            el.dispatchEvent(inputEvent);

            const changeEvent = new Event("change", {
                bubbles: true,
                cancelable: true,
            });
            el.dispatchEvent(changeEvent);
            simulateSpaceKeyPress(el); // Pass the element as an argument
        }
    }
}

function masterCorrection(text) {
    text = text.replace("Ob ich das ist doch nicht richtig verstanden", "Habe ich das doch nicht richtig verstanden")
    text = text.replace("musst du das noch nicht gemacht", "hast du das noch nicht gemacht")
    text = text.replace("mitteilen worden", "mitteilen wollen")
    text = text.replace("Ich werde wieder froh", "Ich wäre wieder froh")
    text = text.replace("natürlich da", "natürlich doch")

    return text
}

function replaceSwearWords(text) {
    const swearWordMap = {
        "f*****": "ficken",
        "f****": "Fotze",
        "n****": "Nutte",
        "h***": "Hure",
        "s*******": "Schlampe",
        "n********": "Natursekt",
        "w******": "wichsen",
        "a*******": "Arschloch"
    };

    Object.keys(swearWordMap).forEach(censoredWord => {
        const uncensoredWord = swearWordMap[censoredWord];
        escapeRegExp = censoredWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes special characters
        const pattern = new RegExp(escapeRegExp, "gi");
        text = text.replace(pattern, uncensoredWord);
    });
    text = text.replace(/\*/g, ''); // Remove any remaining asterisks

    return text;
}

function capitalizeSentences(text) {
    return text.replace(/([.!?]\s*)([a-zäöüß])/g, (match, separator, letter) => {
        return separator + letter.toUpperCase();
    });
}

function uppercaseFix(text) {
    text = text.replace("Du", "du")
    text = text.replace("Dir", "dir")
    text = text.replace("Dich", "dich")

    return text
}

function simulateSpaceKeyPress(element) {
    const spaceKeyDownEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
    });

    const spaceKeyUpEvent = new KeyboardEvent('keyup', {
        key: ' ',
        bubbles: true,
        cancelable: true,
    });

    // Dispatch the keydown and keyup events on the specified element
    element.dispatchEvent(spaceKeyDownEvent);
    element.dispatchEvent(spaceKeyUpEvent);
}

function isPeriodNeeded(text) {

    // Remove leading/trailing whitespace and normalize spaces
    text = text.trim().replace(/\s+/g, ' ');

    // Handle comma placement after specific conjunctions and phrases
    const conjunctionsAndPhrases = [
        'ich hoffe', 'ich mache', 'ich habe es', 'das habe ich mir'
        // Add more conjunctions and phrases as needed
    ];
    for (const term of conjunctionsAndPhrases) {

        // EXLUSIONS ADD HERE
        if ((term == 'denn' && text.includes('du denn') == true || term == 'denn' && text.includes('Du denn') == true)) {
        }
        else {
            const conjunctionRegex = new RegExp(`\\b${term}\\b`, 'gi');
            text = text.replace(conjunctionRegex, (match) => '. ' + match.toLowerCase());
        }
    }

    // Adjust spaces around periods
    text = text.replace(/\s*,/g, '.');

    // Add a space after opening quotation marks and before closing quotation marks
    text = text.replace(/(["„])([^\s])/g, '$1 $2');
    text = text.replace(/([^\s])(["“])/g, '$1 $2');

    return text;
}

function isCommaNeeded(text) {

        // Remove leading/trailing whitespace and normalize spaces
    text = text.trim().replace(/\s+/g, ' ');

    // Handle comma placement after specific conjunctions and phrases
    const conjunctionsAndPhrases = [
        'aber', 'dass', 'weil', 'wenn', 'obwohl', 'denn', 'bis', 'nachdem', 'bevor', 'was sich', 'Danke dir', 'Hallo', 'ansonsten'
    ];
    for (const term of conjunctionsAndPhrases) {

        // EXLUSIONS ADD HERE
        if ((term == 'denn' && text.includes('du denn') == true || term == 'denn' && text.includes('Du denn') == true)) {
        }
        if ((term == 'denn' && text.includes('dir denn') == true || term == 'denn' && text.includes('Dir denn') == true )) {
        }
        if ((term == 'denn' && text.includes('mich denn') == true || term == 'denn' && text.includes('Mich denn') == true )) {
        }
        if ((term == 'denn' && text.includes('mir denn') == true || term == 'denn' && text.includes('Mir denn') == true )) {
        }
        if ((term == 'denn' && text.includes('dich denn') == true || term == 'denn' && text.includes('Dich denn') == true )) {
        }
        if ((term == 'aber' && text.includes('dass aber') == true )) {
        }
        if (( term == 'denn?' || term == 'denn!' || term == 'denn.' )) {
        }
        if ((term == 'aber' && text.includes('mich aber') == true || term == 'aber' && text.includes('Mich aber') == true )) {
        }
        if ((term == 'aber' && text.includes('dich aber') == true || term == 'aber' && text.includes('Dich aber') == true )) {
        }
        if ((term == 'aber' && text.includes('sich aber') == true || term == 'aber' && text.includes('Sich aber') == true)) {
        }
        else {
            const conjunctionRegex = new RegExp(`\\b${term}\\b`, 'gi');
            text = text.replace(conjunctionRegex, (match) => ', ' + match.toLowerCase());
        }
    }

    // AFTER COMMA CLEANER
    text = text.replace('schon, aber', 'schon aber');
    text = text.replace('wie du', ', wie du');
    text = text.replace('wie sie', ', wie sie');
    text = text.replace('wie es', ', wie es');
    text = text.replace('wie ich', ', wie ich');
    text = text.replace('ich, denn', 'du denn')
    text = text.replace('du, denn', 'du denn');

    // Adjust spaces around commas
    text = text.replace(/\s*,/g, ',');

    // Add a space after opening quotation marks and before closing quotation marks
    text = text.replace(/(["„])([^\s])/g, '$1 $2');
    text = text.replace(/([^\s])(["“])/g, '$1 $2');

    return text;

}

function isQuestionNeeded(text) {
    // List of common German question words and phrases
    const germanQuestionWords = ['wer', 'was', 'wo', 'wann', 'warum', 'wie', 'welche', 'wem', 'willst', 'oder nicht', 'oder möchtest'];

    // Split the text into sentences using periods
    const sentences = text.split('. ');

    // Process each sentence
    const processedSentences = sentences.map((sentence, index) => {
        // Remove leading and trailing whitespace
        sentence = sentence.trim();

        // Check if the sentence starts with a German question word or contains "oder möchtest"
        let needsQuestionMark = false;
        for (const word of germanQuestionWords) {
            if (sentence.toLowerCase().startsWith(word) || sentence.toLowerCase().includes('oder möchtest')) {
                needsQuestionMark = true;
                break;
            }
        }

        // Add a question mark if needed
        if (needsQuestionMark && !sentence.endsWith('?')) {
            sentence += '?';
        }

        return sentence;
    });

    // Join the processed sentences and return the result
    return processedSentences.join('. ');
}

function masterCleaner(text) {
    // Remove leading non-letter characters
    let cleanedText = text.replace(/^[^a-zA-ZÄÖÜäöüß]+/, '');

    // Capitalize the first letter
    cleanedText = cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1);

    // Remove double punctuations
    cleanedText = cleanedText.replace(',,', ',')
    cleanedText = cleanedText.replace('??', '?')
    cleanedText = cleanedText.replace('!!', '!')
    cleanedText = cleanedText.replace('..', '.')
    cleanedText = cleanedText.replace("?,", ",")
    cleanedText = cleanedText.replace(",?", ",")
    cleanedText = cleanedText.replace("..", ".")
    cleanedText = cleanedText.replace(". .", ".")

    return cleanedText;
}

function AutomaticPunctuation(text) {
    text = isQuestionNeeded(text)
    text = isCommaNeeded(text)
    
    return text
}

function Grammar(text) {
    text = masterCorrection(text);
    text = replaceSwearWords(text); // Swearword detection
    text = capitalizeSentences(text); // Capitilition
    text = AutomaticPunctuation(text); // Automatic punctuation
    text = uppercaseFix(text);
    text = masterCleaner(text);

    return text
};

