window.jswp = window.jswp || {};

(function() {
    var exports = {};

    var onePointInCm = 2.54 / 72;
	var onePointInMicrons = onePointInCm * 10000;
	
    exports.clear = function(ctx) {
        //Gray background
        ctx.fillStyle = "#eee";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    exports.drawPage = function(ctx, x, y, pageSettings) {
        //Assume 100dpi and express everything in centimeters
        ctx.save();
        var scale = 100 / 2.54;
        ctx.scale(scale, scale);
        ctx.translate(x, y);

        //White page with a 0.5pt border
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = onePointInCm / 2;
        ctx.beginPath();
        ctx.rect(0, 0, pageSettings.width, pageSettings.height);
        ctx.fill();
        ctx.stroke();

        ctx.translate(pageSettings.margins.left, pageSettings.margins.top);
        ctx.font = (12 * onePointInMicrons) + "px Verdana";
        ctx.fillStyle = "#000";

        //Set microns
        ctx.scale(0.0001, 0.0001);
        ctx.fillText("Hello world, this is a string of text in Verdana 12pt.", 0, 0);
        ctx.restore();
    };

    //Export public functions
    window.jswp.PageRendering = exports;
})();