window.jswp = window.jswp || {};

(function() {
    var exports = {};

    /*
    Apply a style to the canvas context.
    */
    function applyStyle(ctx, style) {
        ctx.font = "12px Verdana";
        ctx.fillStyle = "#000";
    }

    function write(container, text) {
        if(text) {
            var textElem = document.createTextNode(text);
            container.appendChild(textElem);
        }
    }
    
    function writeTag(container, tag, text) {
        var tagElem = document.createElement(tag);
        container.appendChild(tagElem);
        write(tagElem, text);
        return tagElem;
    }
    
    exports.measureFont=measureFont;
    function measureFont(fontName, fontSize) {
        /*
        Write a text in 200px font size and a text in 100px font size, baseline aligned.
        The difference in coordinates of the two bounding rects gives the ascent/descent of a 100px font size.
        */
        var div = writeTag(document.body, "div", "gM");
        var span = writeTag(div, "span", "gM");
        div.style.fontFamily = fontName;
        div.style.fontWeight = "bold";
        div.style.fontSize = "200px";
        span.style.fontSize = "100px";
        var rect1 = div.getBoundingClientRect();
        var rect2 = span.getBoundingClientRect();
        var ascent = rect2.top - rect1.top;
        var descent = rect1.bottom - rect2.bottom;
        document.body.removeChild(div);
        
        return {
            ascent: ascent * fontSize / 100,
            descent: descent * fontSize / 100
        };
    }
    
    /*
    Measure a word
    */
    function measureWord(ctx, word) {
        applyStyle(ctx, word.style);
        var metrics = ctx.measureText(word.text);
        word.width = metrics.width;
        word.ascent = metrics.emHeightAscent;
        word.descent = metrics.emHeightDescent;
        word.height = word.ascent + word.descent;
    }

    /*
    Measure an array of words
    */
    exports.measureWords = measureWords;

    function measureWords(ctx, words) {
        for (var i = 0; i < words.length; i++)
            measureWord(ctx, words[i]);
    }

    /*
    Get a line and try to fill it word by word. At the end, check that we are inside the available height.
    If the maximum line height has been overflowed, then discard this line and try again with the next line.
    If we are inside the available height, then we confirm the line layout.
    */
    exports.allocateWordsIntoLines = allocateWordsIntoLines;

    function allocateWordsIntoLines(container, words, interLineSpacing) {
        var lines = [];

        //We reason word by word, starting from the first word
        var wordIndex = 0;

        //Place words into lines until we placed all words
        while (wordIndex < words.length) {
            var line = container.getLine();
            var placement = allocateWordsIntoLine(line, words, wordIndex);
            if (placement.height > line.maxHeight) {
                //Not enough room, so give up and try again on next line from the same wordIndex
                line.useHeight(line.maxHeight);
            }
            else {
                //This line is ok, let's confirm the height used
                line.useHeight(placement.height + interLineSpacing);

                //Put the words into the line
                lines.push({
                    x1: line.x1,
                    x2: line.x2,
                    y1: line.y1,
                    y2: line.y1 + placement.height,
                    words: placement.words
                });

                //Advance to the next word
                wordIndex = placement.nextWordIndex;
            }
        }

        return lines;
    }

    /*
    Determine how may words may fit on a line, starting from firstWordIndex.
    */
    function allocateWordsIntoLine(line, words, firstWordIndex) {
        var x = line.x1;
        var wordIndex = firstWordIndex;
        var placedWords = [];
        var maxHeight = 0;
        while (wordIndex < words.length) {
            var word = words[wordIndex];
            x += word.width;

            if (x < line.x2) {
                //This word fits. Let's continue with next word
                placedWords.push(word);
                maxHeight = Math.max(maxHeight, word.height);
                wordIndex++;
            }
            else {
                //This word doesn't fit, the line is complete. Next layout will start from this word.
                break;
            }
        }

        return {
            words: placedWords,
            nextWordIndex: wordIndex,
            height: maxHeight
        };
    }

    //Export public functions
    window.jswp.TextLayout = exports;
})();
