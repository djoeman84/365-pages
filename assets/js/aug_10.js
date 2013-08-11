var img_num = 0;
var sprite_doc = 0;
$(document).ready(function () {
	var bambi_div = document.getElementById('bambi-div');
	setInterval(function (argument) {
		bambi_div.className = 'sprite'+Math.floor(img_num/18)+' bambi_'+(img_num + 1);
		img_num++;
		if (img_num === 18*4) {
			img_num = 0;
			console.log('hi');
		}
		
	}, 30);
});