function Carousel (elem, settings) {
	/* Private Variables */
	var _settings;
	var _carousel_elem;
	var _carousel_ul;
	var _carousel_lis = [];
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

		var num_tiles = _settings.load_buffer * 2 + _settings.tiles_on_screen;
		for (var i = 0; i < num_tiles; i++) {
			var new_li = _get_li(i);
			_carousel_lis.push(new_li);
			_carousel_ul.appendChild(new_li);
		};
		var num_tiles_to_disp = _settings.load_buffer + _settings.tiles_on_screen;
		for (var i = 0; i < num_tiles_to_disp; i++) {
			var tile = _get_tile(i);
			console.log(tile);
			if (tile) _carousel_lis[_tile_num_of_left+i].appendChild(tile.get_elem());
		};
	}
	function _get_li (index) {
		var new_li = document.createElement('li');
		new_li.setAttribute('tile_num',index);
		new_li.id = 'tile-'+index.toString();
		new_li.className = 'carousel-tile-li';
		new_li.style.position = 'absolute';
		new_li.style.left = ((0 - _settings.load_buffer + index) * _gap_between_tiles).toString() + '%';
		new_li.style.width = _gap_between_tiles.toString()+'%';
		new_li.style.height = _settings.height;
		new_li.style.overflow = 'hidden';
		new_li.style.padding = _settings.padding;
		return new_li;
	}
	function _default_settings (settings) {
		settings                 = (settings || {});
		settings.load_buffer     = (settings.load_buffer || 2);
		settings.tiles_on_screen = (settings.tiles_on_screen || 1);
		settings.height          = (settings.height || '100%');
		settings.tile_style      = (settings.tile_style || 'full');
		settings.padding         = (settings.padding || '0px');

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
		return car_ul;
	}

	/* Public Methods */
	this.slide_right = function (delta_tiles) {
		delta_tiles = (delta_tiles || 1);
		console.log(delta_tiles);
	}
	this.slide_left = function (delta_tiles) {
		delta_tiles = (delta_tiles || 1);
	}

	this.get_settings = function () {
		console.log('WARNING: FOR DEVELOPMENT ONLY!!!');
		return _settings;
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
}
ImgTile.prototype.get_elem = function () {
	return _contents;
}


