/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
var temp_json = '{"request": {"pages": [{"href": "http://365-pages.appspot.com/4-AUG", "title": "Random Article Generator"}, {"href": "http://365-pages.appspot.com/5-AUG", "title": "Translation Machine"}, {"href": "http://365-pages.appspot.com/6-AUG", "title": "Colors!"}, {"href": "http://365-pages.appspot.com/7-AUG", "title": "Ski Slope"}, {"href": "http://365-pages.appspot.com/8-AUG", "title": "Cookies"}, {"href": "http://365-pages.appspot.com/9-AUG", "title": "Text Analytics"}, {"href": "http://365-pages.appspot.com/10-AUG", "title": "Bambi"}, {"href": "http://365-pages.appspot.com/11-AUG", "title": "Ducks"}, {"href": "http://365-pages.appspot.com/12-AUG", "title": "CSS3 Drop-downs"}, {"href": "http://365-pages.appspot.com/13-AUG", "title": "Shapes"}, {"href": "http://365-pages.appspot.com/14-AUG", "title": "Accelerometer Ball"}, {"href": "http://365-pages.appspot.com/15-AUG", "title": "Falling Text"}, {"href": "http://365-pages.appspot.com/16-AUG", "title": "Hello Goole Maps"}, {"href": "http://365-pages.appspot.com/17-AUG", "title": "Color Tiles"}, {"href": "http://365-pages.appspot.com/18-AUG", "title": "Digital Clock"}, {"href": "http://365-pages.appspot.com/19-AUG", "title": "Facebook"}, {"href": "http://365-pages.appspot.com/20-AUG", "title": "Facebook API 2"}, {"href": "http://365-pages.appspot.com/21-AUG", "title": "Friend Finder"}, {"href": "http://365-pages.appspot.com/22-AUG", "title": "Pretty Form"}, {"href": "http://365-pages.appspot.com/23-AUG", "title": "Spinning Text"}, {"href": "http://365-pages.appspot.com/24-AUG", "title": "Build a Page"}, {"href": "http://365-pages.appspot.com/25-AUG", "title": "Zen Loading"}, {"href": "http://365-pages.appspot.com/26-AUG", "title": "Dyslexic Math"}]}}';

var pages_json;

//// preferences /////
   var
   	 num_carousel_loading_tiles_left  = 1,
   	 num_carousel_loading_tiles_right = 1,
   	 num_carousel_tiles_to_display    = 3,
   	 segue_time_between_times         = 1*second;

function init_js () {
	if (true) {
		console.log('USING TEMP VALUE FOR JSON FOR LOCAL DEBUGGING!!!!');
		json_loaded(JSON.parse(temp_json));
	} else {
		get_json_from_url('http://365-pages.appspot.com/json?api=pgs',
						json_loaded);
	}
	init_carousel_blocks();
}

function json_loaded (json) {
	pages_json = json;
	console.log('json loaded');
}

function move_right () {
	get_left_most($('.carousel-tile')).style.left = (parseFloat((get_right_most($('.carousel-tile')).style.left).replace('%','')) + (100/num_carousel_tiles_to_display)).toString() + '%';
	$('.carousel-tile').animate({left:'-='+(
		(100/num_carousel_tiles_to_display).toString()
		)+'%'}, segue_time_between_times);
}

function move_left () {
	get_right_most($('.carousel-tile')).style.left = (parseFloat((get_left_most($('.carousel-tile')).style.left).replace('%','')) - (100/num_carousel_tiles_to_display)).toString() + '%';
	$('.carousel-tile').animate({left:'+='+(
		(100/num_carousel_tiles_to_display).toString()
		)+'%'}, segue_time_between_times);
}


function get_left_most (tiles) {
	var left_most;
	for (var i = 0; i< tiles.length; i++) {
		if(left_most === undefined 
			|| parseFloat(tiles[i].style.left.replace('%','')) 
			< parseFloat(left_most.style.left.replace('%',''))) {
			left_most = tiles[i];
		}
	}
	return left_most
}

function get_right_most (tiles) {
	var right_most;
	for (var i = 0; i < tiles.length; i++) {
		if(right_most === undefined 
			|| parseFloat(tiles[i].style.left.replace('%','')) 
			> parseFloat(right_most.style.left.replace('%',''))) {
			right_most = tiles[i];
		}
	}
	return right_most;
}

function init_carousel_blocks () {
	var total_tiles = num_carousel_loading_tiles_left +
						num_carousel_tiles_to_display +
						num_carousel_loading_tiles_right;

	var tiles_ul = document.getElementById('carousel-tiles-ul');
	for (var i = 0; i < total_tiles; i++) {
		var tile = create_carousel_tile(i.toString());
		$(tile).css('left',( //move tiles to appropriate positions
			(i- num_carousel_loading_tiles_left)*
			(100/num_carousel_tiles_to_display)
			).toString()+'%');
		tiles_ul.appendChild(tile);
	};
}

function create_carousel_tile (id) {
	var tile = document.createElement('li');
	tile.id = id;
	tile.className = 'carousel-tile';
	return tile;
}


$(document).keydown(function (e) {
	switch (e.keyCode) {
		case key.left:
			console.log('left');
			move_left();
			return false;
		case key.right:
			console.log('right');
			move_right();
			return false;
		default:
			return true;
	}
})