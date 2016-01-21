window.jswp = window.jswp || {};

(function () {
    var exports = {};

    exports.layoutParagraph = function (container, paragraph) {
        var line = container.peekLine();
        var x = line.x1;
        var word = paragraph.peekWord();
        if (x + word.width < line.x2) {
            //OK, room available for the word
        }
    };

    //Export public functions
    window.jswp.TextLayout = exports;
})();
