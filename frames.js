/**
 * frames.js for 23 Video v0.1
 * A jQuery plugin for creating dynamic thumbnails on 23 Video websites
 *
 * Kalle Kabell, kalle@23company.com
 * http://23video.com
 */

(function( $ ){

    $.fn.frames = function( options ) {

	// Default settings
	var settings = $.extend({
	    frameCount: 6,
	    interval: 1500
	}, options);

	var intervals = [];

	return this.each(function() {

	    // Save references to the image; as DOM element and as jQuery object
	    var that = this;
	    var $that = $(that);

	    // Which element should activate the cycle when hovered over?
	    that.hoverElement = $that.parent().children(settings.hoverElement)[0] || that;

	    // Save the path to the original thumbnail
	    that.original = $that.attr("src");

	    // Split original path into "basic" parts for building new image src's later
	    // TODO: Support URLs containing hostname
	    that.uri = that.original.split("/");
	    that.tree = that.uri[1];
	    that.id = that.uri[2];
	    that.token = that.uri[3];
	    that.path = "/" + that.tree + "/" + that.id + "/" + that.token + "/";

	    that.dimensions = $that.width() + "x" + $that.height();

	    // Get video length from the the data-length attribute; if not found, assume min-length of 60 secs
	    that.length = parseInt($that.attr("data-length")) || 60;

	    that.time = 0;
	    that.shown = -1;
	    that.shownIdent = -1;

	    // Returns a relative path to keyframe <time> seconds into the video
	    var getThumbnailPath = function(time) {
		return that.path + that.dimensions + ":" + time + "/thumbnail.jpg";
	    };

	    // Starts the image cycle
	    var cycle = function() {

		// Request all frames at once and save them in an array when loaded
		var loadedFrames = [];
		for (var i = 1; i <= settings.frameCount; i += 1) {
		    that.time = (that.length / settings.frameCount * i) >> 0;
		    var img = $("<img />");
		    img.attr("data-ident", i);
		    img.attr("src", getThumbnailPath(that.time)).load(function(){
			loadedFrames.push($(this).attr("data-ident"));
		    });
		}

		// Creates an interval that cycles through all loaded frames
		// Saves a reference to the interval in an array for clearing later
		intervals.push(setInterval(function() {

		    // Sort loaded images numerically
		    loadedFrames.sort(function(a,b){return a-b});

		    // Update that.shown to current index of the frame shown
		    that.shown = loadedFrames.indexOf(that.shownIdent);

		    // Go to next frame in array
		    if (that.shown < loadedFrames.length - 1) {
			that.shown += 1;
		    } else {
			that.shown = 0;
		    }
		    that.shownIdent = loadedFrames[that.shown];

		    // Set time in seconds for the next keyframe
		    that.time = (that.length / settings.frameCount * loadedFrames[that.shown]) >> 0;

		    // Change src of the img
		    $that.attr("src", getThumbnailPath(that.time));

		}, settings.interval));
	    };

	    // Clears intervals currently running
	    var clearIntervals = function() {
		for (var i = 0; i < intervals.length; i += 1) {
		    clearInterval(intervals[i]);
		}
	    };

	    // Reset image to original source and counting variables to original values
	    var reset = function() {
		$that.attr("src", that.original);
		that.shown = -1;
		that.shownIdent = -1;
	    };

	    // Activates the cycle when mouse enters the specified hover element
	    $(that.hoverElement).mouseenter(function() {
		clearIntervals();
		cycle();
	    });

	    // Clears all intervals and resets counting variables when mouse leaves the hover element
	    $(that.hoverElement).mouseleave(function() {
		clearIntervals();
		reset();
	    });

	});

    };

})( jQuery );
