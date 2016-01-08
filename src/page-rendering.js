window.jswp = window.jswp || {};

(function() {
    var exports = {};

    var onePointInCm = 2.54 / 72;

    exports.clear = function(ctx) {
        //Gray background
        ctx.fillStyle = "#ccc";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    exports.drawPage = function(ctx, x, y, pageSettings) {
        //Assume 100dpi and express everything in centimeters
        ctx.save();
        var scale = 100 / 2.54;
        ctx.scale(scale, scale);
        ctx.translate(x, y);

        //White page with a 1pt border
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = onePointInCm;
        ctx.beginPath();
        ctx.rect(0, 0, pageSettings.width, pageSettings.height);
        ctx.fill();
        ctx.stroke();

        ctx.translate(pageSettings.margins.left, pageSettings.margins.top);
        ctx.font = "12px Verdana";
        ctx.fillStyle = "#000";

        //Back to pt
        ctx.scale(1 / scale, 1 / scale);
        ctx.fillText("Hello world, this is a string of text in Verdana 12pt.", 0, 0);
        ctx.restore();
    };

    //Export public functions
    window.jswp.PageRendering = exports;
})();