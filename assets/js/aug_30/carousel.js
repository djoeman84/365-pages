function Carousel (elem, settings) {
	/* Private Variables */
	var _settings;
	var _carousel_elem;
	var _carousel_ul;
	var _carousel_tiles = [];
	//
	var _curr_left_index = 0;//index of tile on the left side of the screen
	var _tile_num_of_left;//tile number of the tile to the left side of the screen
	var _gap_between_tiles;

	/* First Run */
	_init(settings, elem);


	/* Private Methods */
	function _init (settings, elem) {
		if(!elem) {_error('Missing Required Parameter: Carousel Constructor requires target DOM Element');return;}
		_settings = _default_settings(settings);
		_carousel_elem = elem;

		_set_init_vars();

		_init_carousel_contents();
	}
	function _error (message) {
		console.log('Carousel Error: '+message);
	}
	function _init_carousel_contents () {
		_carousel_ul = _create_carousel_ul();
		_carousel_elem.appendChild(_carousel_ul);
		if (_settings.backgroundColor) {
			_carousel_elem.style.backgroundColor = _settings.backgroundColor;
		} else if(_settings.backgroundImage) {
			_carousel_elem.style.backgroundImage = _settings.backgroundImage;
		}

		var num_tiles = _settings.load_buffer * 2 + _settings.tiles_on_screen;
		for (var i = 0; i < num_tiles; i++) {
			var new_wrapper = _get_tile_wrapper();
			var new_li = _get_li(i, new_wrapper);
			_carousel_tiles.push({'wrapper':new_wrapper,'li':new_li});
			_carousel_ul.appendChild(new_li);
		};
		var num_tiles_to_disp = _settings.load_buffer + _settings.tiles_on_screen;
		for (var i = 0; i < num_tiles_to_disp; i++) {
			var tile = _get_tile(i);
			
			if (tile && tile.get_elem()) _carousel_tiles[_tile_num_of_left+i].wrapper.appendChild(tile.get_elem());
		};
	}
	function _get_li (index, tile_wrapper) {
		var new_li = document.createElement('li');
		new_li.setAttribute('tile_num',index);
		new_li.id = 'tile-'+index.toString();
		new_li.className = 'carousel-tile-li';
		new_li.style.position = 'absolute';
		var pos_from_left = ((0 - _settings.load_buffer + index) * _gap_between_tiles);
		new_li.style.left   = pos_from_left.toString() + '%';
		new_li.style.width  = _gap_between_tiles.toString() + '%';
		new_li.style.height = _settings.height;
		new_li.style.overflow = 'hidden';
		new_li.appendChild(tile_wrapper);
		return new_li;
	}
	function _get_tile_wrapper () {
		var new_wrapper = document.createElement('div');
		new_wrapper.style.margin  = _settings.margin;
		new_wrapper.style.overflow = 'hidden';
		new_wrapper.style.height = (100 - 2*parseFloat(_settings.margin)).toString()+'%';
		new_wrapper.style.width  = (100 - 2*parseFloat(_settings.margin)).toString()+'%';
		return new_wrapper;
	}
	function _default_settings (settings) {
		settings                 = (settings || {});
		settings.load_buffer     = (settings.load_buffer || 2);
		settings.tiles_on_screen = (settings.tiles_on_screen || 1);
		settings.height          = (settings.height || '100%');
		settings.tile_style      = (settings.tile_style || 'full');
		settings.margin          = (settings.margin || '0px');
		settings.tile_slide_time = (settings.tile_slide_time || 0.6*second);

		if(settings.arrows === undefined) settings.arrows = true;
		if(!settings.tile_at_index 
		  && typeof tile_at_index === 'function'){
								      settings.tile_at_index = tile_at_index;
		}
		return settings;
	}
	function _set_init_vars () {
		_gap_between_tiles = 100/_settings.tiles_on_screen;
		_tile_num_of_left  = _settings.load_buffer; //leftmost tile will be (_settings.load_buffer) tiles from the 0th tile
	}
	function _get_tile (index) {
		if (_settings.tile_at_index) return _settings.tile_at_index(index);
	}
	function _create_carousel_ul () {
		var car_ul = document.createElement('ul');
		car_ul.style.listStyleType = 'none';
		car_ul.style.position = 'relative';
		car_ul.style.overflow = 'hidden';
		car_ul.style.width = '100%';
		car_ul.style.height = '100%';
		car_ul.style.padding = 0;
		car_ul.style.margin = 0;
		return car_ul;
	}
	function get_left_most_tile_index () {
		var left_most;
		for (var i = 0; i< _carousel_tiles.length; i++) {
			if(left_most === undefined 
				|| parseFloat(_carousel_tiles[i].li.style.left) 
				< parseFloat(_carousel_tiles[left_most].li.style.left)) {
				left_most = i;
			}
		}
		return left_most
	}

	function get_right_most_tile_index () {
		var right_most;
		for (var i = 0; i < _carousel_tiles.length; i++) {
			if(right_most === undefined 
				|| parseFloat(_carousel_tiles[i].li.style.left) 
				> parseFloat(_carousel_tiles[right_most].li.style.left)) {
				right_most = i;
			}
		}
		return right_most;
	}
	function shift_all_tiles (dist) {
		if (dist > 0) {
			var rightmost = _carousel_tiles[get_right_most_tile_index()];
			rightmost.li.style.left = (0 - (_gap_between_tiles * (_settings.load_buffer + 1))).toString() + '%';
		} else if (dist < 0) {
			var leftmost  = _carousel_tiles[get_left_most_tile_index()];
			leftmost.li.style.left  = (0 + (_gap_between_tiles * (_settings.tiles_on_screen + _settings.load_buffer))).toString() + '%';
		} else {return;}
		for (var i = 0; i < _carousel_tiles.length; i++) {
			var tile_obj = _carousel_tiles[i];
			var old_li_left = parseFloat((tile_obj.li.style.left));

			$(tile_obj.li).animate({left:'+='+(dist).toString()+'%'},
					_settings.tile_slide_time);
		};
	}

	/* Public Methods */
	this.slide_right = function () {
		if ($('.carousel-tile-li').is(':animated')) return;
		var new_rightmost_index_onscreen = (_curr_left_index + _settings.tiles_on_screen);
		if (_get_tile(new_rightmost_index_onscreen)) {//only move right if the user has defined a tile for that position
			_curr_left_index++;

			//reset body of leftmost, animation will move it to the right side. Buffer loads elems before they are onscreen
			var leftmost = _carousel_tiles[get_left_most_tile_index()];
			leftmost.wrapper.innerHTML = '';
			var new_right_tile = _get_tile(_curr_left_index + _settings.tiles_on_screen + _settings.load_buffer - 1);
			if (new_right_tile && new_right_tile.get_elem()) leftmost.wrapper.appendChild(new_right_tile.get_elem());
			
			shift_all_tiles(-_gap_between_tiles);
		}
		else {console.log('denied')}
	}

	this.slide_left  = function () {
		if ($('.carousel-tile-li').is(':animated')) return;
		if ((_curr_left_index - 1 ) >= 0) {
			_curr_left_index--;

			var rightmost = _carousel_tiles[get_right_most_tile_index()];
			rightmost.wrapper.innerHTML = '';
			var new_left_tile = _get_tile(_curr_left_index - settings.load_buffer);
			if (new_left_tile && new_left_tile.get_elem()) rightmost.wrapper.appendChild(new_left_tile.get_elem());

			shift_all_tiles(_gap_between_tiles);
		}
		else {console.log('denied')} 
	}

}


function Tile () {
	/* Private Variables */
	var _contents;

	/* First Run */
	_init();

	/* Private Methods */
	function _init () {}

	/* Public Methods */
	this.set_contents = function (contents) {
		_contents = contents;
	}
	this.get_elem = function () {
		return _contents;
	}
}


ImgTile.prototype = new Tile();
ImgTile.prototype.constructor = ImgTile;
function ImgTile () {
}
ImgTile.prototype.set_contents = function (img_src) {
	_contents = document.createElement('img');
	_contents.src = img_src;
	_contents.style.height = '100%';
	_contents.style.width = '100%';
}
ImgTile.prototype.get_elem = function () {
	return _contents;
}


