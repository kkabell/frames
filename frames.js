/**
 * frames.js for 23 Video v0.2
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
	    interval: 1500,
	    hoverElement: undefined,
	    mode: "skim",
	    showProgress: true,
	    progressColor: "#49A34D",
	    progressAlign: "top",
	    progressHeight: "5%"
	}, options);

	var intervals = [];

	return this.each(function() {

	    // Save references to the image; as DOM element and as jQuery object
	    var that = this;
	    var $that = $(that);

	    var loadedFrames = [];
	    var loadedImg = [];

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

	    var loadFrames = function() {

		// Request all frames at once and save them in an array when loaded
		if (loadedFrames.length === 0) {
		    for (var i = 1; i <= settings.frameCount; i += 1) {
			that.time = (that.length / settings.frameCount * i) >> 0;
			var img = $("<img />");
			img.attr("data-ident", i);
			img.attr("src", getThumbnailPath(that.time)).one("load", function(){

			    // Save numerical identifier
			    loadedFrames.push($(this).attr("data-ident"));

			    // Save reference to object, so http-request doesn't get aborted
			    loadedImg.push(img);

			    // Sort loaded images numerically
			    loadedFrames.sort(function(a,b){return a-b});
			});

			// For images loading from cache, trigger manually
			if (img.complete || (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6)) {
			    img.trigger("load");
			}
		    }
		}
	    };

	    // Starts the image cycle
	    var cycle = function() {

		loadFrames();

		// Creates an interval that cycles through all loaded frames
		// Saves a reference to the interval in an array for clearing later
		intervals.push(setInterval(function() {

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
		    // TODO: Support transition effects
		    $that.attr("src", getThumbnailPath(that.time));

		}, settings.interval));
	    };

	    // Starts skim mode
	    var skim = function() {

		loadFrames();

		// Optionally init and place progress bar
		if (settings.showProgress) {
		    $that.parent().css({position: "relative"});
		    $that.after('<div class="progress"></div>');
		    var progressBar = $that.parent().children(".progress");
		    progressBar.css({
			position: "absolute",
			left: 0,
			height: settings.progressHeight,
			width: "0%",
			backgroundColor: settings.progressColor
		    });
		    if (settings.progressAlign === "bottom") {
			progressBar.css({top: ($that.height() - progressBar.height())});
		    } else {
			progressBar.css({top: 0});
		    }
		}

		var index = -1;
		var x = 0;
		var framesLength = 0;

		$(that.hoverElement).mousemove(function(e){
		    framesLength = loadedFrames.length;

		    // If framesLength's zero - no images loaded yet - use frameCount to show progress "correctly"
		    if (framesLength === 0) {framesLength = settings.frameCount;}

		    // Get mouse x-value relative to img and translate to corresponding frame
		    x = e.pageX - $that.offset().left;
		    index = (x / $that.width() * framesLength) >> 0;

		    // Update image and progress bar
		    if (that.shown !== index) {
			that.shown = index;
			that.time = (that.length / settings.frameCount * (loadedFrames[that.shown] || index + 1)) >> 0;
			$that.attr("src", getThumbnailPath(that.time));
			if (settings.showProgress) {
			    var progressWidth = ((that.shown + 1) / framesLength * 100) + "%";
			    progressBar.css({width: progressWidth});
			}
		    }
		});
	    };

	    // Clears intervals currently running
	    var clearIntervals = function() {
		for (var i = 0; i < intervals.length; i += 1) {
		    clearInterval(intervals[i]);
		}
		// Remove all cleared intervals, since they are not used anymore
		intervals = [];
	    };

	    // Reset image to original source and counting variables to original values
	    var reset = function() {
		clearIntervals();
		$(that.hoverElement).unbind("mousemove");
		$that.attr("src", that.original);
		that.shown = -1;
		that.shownIdent = -1;
		if (settings.showProgress) {
		    $that.parent().children(".progress").remove();
		}
	    };

	    // Activates the cycle when mouse enters the specified hover element
	    $(that.hoverElement).mouseenter(function() {
		if (settings.mode === "cycle") {
		    cycle();
		} else if (settings.mode === "skim") {
		    skim();
		}
	    });

	    // Clears all intervals and resets counting variables when mouse leaves the hover element
	    $(that.hoverElement).mouseleave(function() {
		reset();
	    });

	});

    };

})( jQuery );
