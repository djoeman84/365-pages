function init_js () {
	var sec_tens = document.getElementById('sec_tens');
	var sec_ones = document.getElementById('sec_ones');

	setInterval(function () {
		var d = new Date();
		var s_tens = Math.floor(d.getSeconds()/10);
		var s_ones = d.getSeconds()%10;
		if (s_tens !== parseInt(sec_tens.innerHTML)) {
			//sec_tens.innerHTML = ' ';
			sec_tens.className += ' flip';
			setTimeout(function () {
				sec_tens.className = sec_tens.className.replace(' flip','');
				sec_tens.innerHTML = s_tens;
			}, 1000/4);
		}
		if (s_ones !== parseInt(sec_ones.innerHTML)) {
			//sec_ones.innerHTML = ' ';
			sec_ones.className += ' flip';
			setTimeout(function () {
				sec_ones.className = sec_ones.className.replace(' flip','');
				sec_ones.innerHTML = s_ones;
			}, 1000/4);
		}
		console.log(d.getSeconds());
	},1000);
}