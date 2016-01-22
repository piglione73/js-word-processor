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

	var getTextHeight = function(font) {
TODO:
  var text = $('<span>Hg</span>').css({ fontFamily: font });
  var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');

  var div = $('<div></div>');
  div.append(text, block);

  var body = $('body');
  body.append(div);

  try {

    var result = {};

    block.css({ verticalAlign: 'baseline' });
    result.ascent = block.offset().top - text.offset().top;

    block.css({ verticalAlign: 'bottom' });
    result.height = block.offset().top - text.offset().top;

    result.descent = result.height - result.ascent;

  } finally {
    div.remove();
  }

  return result;
};
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
