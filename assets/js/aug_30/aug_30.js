var main_carousel;



function init_js () {
	main_carousel = new Carousel(document.getElementById('carousel'),{height:'100%',padding:'0%'});
	for (var i = 0; i < 5; i++) {
		setTimeout(function () {
			main_carousel.slide_right()
		}, 1000*i);
	};
}

function tile_at_index (index) {
	// var tile = new Tile();
	// var elem = document.createElement('div');
	// elem.innerHTML = index.toString();
	// tile.set_contents(elem);
	// return tile;
	var tile = new ImgTile();
	tile.set_contents('http://images3.wikia.nocookie.net/__cb20130606164014/animalcrossing/images/3/30/Monkey.jpg');
	return tile;
}