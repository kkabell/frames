(function( $ ){

    $.fn.frames = function( options ) {

	var settings = $.extend({
	    numberOfFrames = 5;
	}, options);
	var interval;

	return this.each(function() {

	    var that = this;
	    var $that = $(that);

	    that.original = $that.attr("src");

	    that.uri = that.original.split("/");
	    that.id = that.uri[2];
	    that.token = that.uri[3];
	    that.time = 0;
	    that.width = $(that).width();
	    that.height = $(that).height();
	    that.dimensions = that.width + "x" + that.height;
	    that.length = 0;
	    that.shown = 0;

	    var cycle = function(video_length) {
		interval = setInterval(function() {
		    if (that.shown < 5) {
			that.shown++;
		    } else {
			that.shown = 1;
		    }
		    that.time = (video_length / 6 >> 0) * that.shown;
		    $(that).attr("src", "/api/photo/frame?photo_id=" + that.id + "&time=" + that.time + "&token=" + that.token);
		}, 1000);
	    };

	    $that.hover(
		function() {
		    if (interval != undefined) {
			clearInterval(interval);
		    }
		    $(that).width("auto");
		    if (that.length == 0) {
			$.ajax({
			    url: "/api/photo/list?format=json&photo_id=" + that.id,
			    success: function(response) {
				eval( response );
				that.length = parseInt(visual.photo.video_length);
				cycle(that.length);
			    }
			});
		    } else {
			cycle(that.length);
		    }
		},
		function() {
		    $(that).attr("src", that.original);
		    if (interval != undefined) {
			clearInterval(interval);
		    }
		}
	    );
	});

    };

})( jQuery );
