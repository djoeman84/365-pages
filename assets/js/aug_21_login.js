var sign_in_interval;

function init_js () {
	sign_in_interval = setInterval(check_if_signed_in(), 1000/2);
}

function check_if_signed_in () {
	FB.api('/me', function(response) {
		if(response.name === undefined) { //not logged in
			hide(document.getElementById('play-button'));
			hide(document.getElementById('logged-in-jumbo'));
			display(document.getElementById('login-button'));

		} else {                          //logged in
			format_logged_in_jumbo(response);
			display(document.getElementById('play-button'));
			display(document.getElementById('logged-in-jumbo'));
			hide(document.getElementById('login-button'));
			clearInterval(sign_in_interval);
		}
	});
}


function login () {
	FB.login(function (response) {
		console.log('logged in');
		check_if_signed_in();
	},{scope:'friends_hometown'});
}


function format_logged_in_jumbo (response) {
	FB.api('/me/picture?type=normal', function(pic_response) {
		var prof_img = document.getElementById('jumbo-prof-pic');
		prof_img.src = pic_response.data.url;
	});
	var prof_greeting = document.getElementById('jumbo-prof-greeting');
	prof_greeting.innerHTML = 'Welcome, '+response.name+'!';
}
