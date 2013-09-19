/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
var rgb = {'red':'255','green':'255','blue':'255'};
function slider_change (elem) {
	if (elem) rgb[elem.name] = elem.value;
	document.body.style.backgroundColor = 'rgb('+rgb.red+','+rgb.green+','+rgb.blue+')';
	document.getElementById('hex').innerHTML = '#'+to_hex(rgb.red, 2)+to_hex(rgb.green, 2)+to_hex(rgb.blue, 2);
	document.getElementById('rgb').innerHTML = 'rgb('+rgb.red+','+rgb.green+','+rgb.blue+')';

	draw_side_bar();
}

function color_click (elem) {
	rgb = rgb_str_to_dict(elem.style.backgroundColor);
	slider_change();
	update_slider();
}

function update_slider () {
	document.getElementById('red-slider').value = rgb.red;
	document.getElementById('green-slider').value = rgb.green;
	document.getElementById('blue-slider').value = rgb.blue;
}

function rgb_str_to_dict (str) {
	str_arr = str.split(/,|[a-z]+|\(|\)/);
	return {'red':str_arr[2],'green':str_arr[3],'blue':str_arr[4]};
}

function to_hex (decimal, padding) {
	decimal = parseInt(decimal);
	var zero_pad = '';
	for (var i = 0; i < padding; i++) {
		zero_pad += '0';
	};
	var hex_str = decimal.toString(16);
	return zero_pad.substr(0, zero_pad.length - hex_str.length) + hex_str;
}

function draw_side_bar () {
	var colors = document.getElementsByClassName('color-option');
	var mid = Math.floor(colors.length/2 + 1);
	var diff_above = {'r':(255 - parseInt(rgb.red))/(mid),
					  'g':(255 - parseInt(rgb.green))/(mid),
					  'b':(255 - parseInt(rgb.blue))/(mid)};
	var diff_below = {'r':(parseInt(rgb.red))/(mid),
					  'g':(parseInt(rgb.green))/(mid),
					  'b':(parseInt(rgb.blue))/(mid)};
	for (var i = 0; i < colors.length; i++) {
		var color;
		if (i < mid) {
			color = 'rgb('+ (Math.round(parseInt(rgb.red) + (mid - i) * diff_above.r)).toString() +','+ (Math.round(parseInt(rgb.green) + (mid - i) * diff_above.g)).toString() +','+ (Math.round(parseInt(rgb.blue) + (mid - i) * diff_above.b)).toString() +')';
			colors[i].style.backgroundColor = color
		} else if (i > mid) {
			color = 'rgb('+(Math.round(parseInt(rgb.red) - (i - mid)* diff_below.r)).toString() +','+(Math.round(parseInt(rgb.green) - (i - mid)* diff_below.g)).toString()+','+(Math.round(parseInt(rgb.blue) - (i - mid)* diff_below.b)).toString()+')';
			colors[i].style.backgroundColor = color;
		} else {
			color = 'rgb('+rgb.red+','+rgb.green+','+rgb.blue+')';
			colors[i].style.backgroundColor = color;
		}
	};
}



slider_change();