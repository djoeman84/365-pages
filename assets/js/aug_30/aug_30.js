var main_carousel;
var page_data;


function init_js () {
	$.getJSON('http://365-pages.appspot.com/json?api=pgs', function (data) {
		page_data = data.request.pages;
		var tiles_on_screen = Math.floor(Math.random() * 3 + 1);
		var margin = (Math.random() * 6).toString() +'%';
		if (Math.random() > 0.5) {
			var colors = ['gray','lightblue','white'];
			var random_color = colors[Math.floor(Math.random() * colors.length)];
			main_carousel = new Carousel(document.getElementById('carousel'),{height:'90%',
																				margin:margin,
																				tiles_on_screen:tiles_on_screen,
																				backgroundColor:random_color});
		} else {
			var backgrounds = ['http://365-pages.appspot.com/img/cream_pixels.png','http://365-pages.appspot.com/img/aug_23/fabric_plaid.png','http://365-pages.appspot.com/img/aug_27/debut_dark.png'];
			var rand_bk = 'url('+backgrounds[Math.floor(Math.random() * backgrounds.length)]+')';
			main_carousel = new Carousel(document.getElementById('carousel'),{height:'90%',
																				margin:margin,
																				tiles_on_screen:tiles_on_screen,
																				backgroundImage:rand_bk});
		}

		
		$(document).keydown(function (e) {
			switch (e.keyCode) {
				case (37): //left
					main_carousel.slide_left();
					break;
				case (39): //right
					main_carousel.slide_right();
					break;
			}
		});
	});
}

var example_types = ['simple-div','pages','img'];
var example_type  = example_types[Math.floor(Math.random() * example_types.length)];
var num_tiles = 17;
function tile_at_index (index) {
	if (page_data) {
		switch (example_type) {
			case ('simple-div'):
				if (index >= num_tiles) return null;
				var tile = new Tile();
				var elem = document.createElement('div');
				var text_elem = document.createElement('div');
				text_elem.innerHTML = index.toString();
				elem.appendChild(text_elem);
				elem.style.backgroundColor = 'white';
				elem.style.height = '100%';
				tile.set_contents(elem);
				return tile;
			case ('img'):
				if (index >= num_tiles) return null;
				var tile = new ImgTile();
				tile.set_contents('http://images3.wikia.nocookie.net/__cb20130606164014/animalcrossing/images/3/30/Monkey.jpg');
				return tile;
			case ('pages'):
				var tile = new Tile();
				var elem = document.createElement('iframe');
				elem.src = page_data[index].href;
				elem.style.height = '100%';
				elem.style.width  = '100%';
				tile.set_contents(elem);
				return tile;
		}
	}
}