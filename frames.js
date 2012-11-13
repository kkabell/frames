(function( $ ){

    $.fn.frames = function( options ) {

	var settings = $.extend({
	    frameCount: 5,
	    interval: 1000
	}, options);
	var intervals = [];

	return this.each(function() {

	    var that = this;
	    var $that = $(that);

	    that.original = $that.attr("src");

	    that.uri = that.original.split("/");
	    that.path = "/" + that.uri[1] + "/" + that.uri[2] + "/" + that.uri[3] + "/";
	    that.id = that.uri[2];
	    that.token = that.uri[3];
	    that.dimensions = $that.width() + "x" + $that.height();
	    that.length = parseInt($that.attr("data-length")) || 60;
	    that.time = 0;
	    that.shown = 0;

	    var getThumbnailPath = function(time) {
		return that.path + that.dimensions + ":" + time + "/thumbnail.jpg";
	    };

	    var cycle = function() {
		for (var i = 1; i <= settings.frameCount; i += 1) {
		    that.time = (that.length / settings.frameCount >> 0) * i;
		    (new Image()).src = getThumbnailPath(that.time);
		}
		intervals.push(setInterval(function() {
		    if (that.shown < settings.frameCount) {
			that.shown += 1;
		    } else {
			that.shown = 1;
		    }
		    that.time = (that.length / settings.frameCount >> 0) * that.shown;
		    $that.attr("src", getThumbnailPath(that.time));
		}, settings.interval));
	    };

	    var clearIntervals = function() {
		for (var i = 0; i < intervals.length; i += 1) {
		    clearInterval(intervals[i]);
		}
	    };

	    var reset = function() {
		$that.attr("src", that.original);
	    };

	    $that.mouseenter(function() {
		clearIntervals();
		cycle();
	    });

	    $that.mouseleave(function() {
		clearIntervals();
		reset();
	    });

	});

    };

})( jQuery );
