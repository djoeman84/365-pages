var friend_data;
var game_interval;
var timer_interval;
var current_friend_index;
var game_pause = false;
var net_distance = 0;

var seconds_per_slide = 6;

function init_game () {
	display_game_body_elems();
	check_map_resize();
	center_map();

	query_fb_for_friends();
}

function transfer_to_login () {
	hide_game_body_elems();
	init_login();
}

function hide_game_body_elems () {
	hideId('game-box-left');
	hideId('game-box-right');
}


function display_game_body_elems () {
	displayId('game-box-left');
	displayId('game-box-right');
}

function query_fb_for_friends () {
	//get uid, name, hometown,
	FB.api('/fql?q='+escape('SELECT uid,name,hometown_location,profile_url FROM user WHERE hometown_location AND uid IN (SELECT uid1 FROM friend WHERE uid2 = me())'),function(r){
		friend_data = r.data;
		play_game();
	});
}

function play_game () {
	shuffle(friend_data);
	current_friend_index = 0;
	update_display();
	game_interval = setInterval(update_display, seconds_per_slide * second);
}

function update_display () {
	current_friend_index++;
	update_prof_pic();
	update_profile_anchor();
	update_timer();
	
	if (current_friend_index === friend_data.length) {
		shuffle(friend_data);
		current_friend_index = 0;
	}
}

function update_prof_pic () {
	FB.api('/'+friend_data[current_friend_index].uid+'?fields=picture.width(200).height(200)', function (r) {
		setImgSrc('jumbo-friend-pic', r.picture.data.url);
	});
}

function update_profile_anchor () {
	var p_anchor = document.getElementById('friend-profile-anchor');
	p_anchor.innerHTML = friend_data[current_friend_index].name;
	p_anchor.href      = friend_data[current_friend_index].profile_url;
}

function update_timer () {
	var timer    = document.getElementById('time');
	var time_left = seconds_per_slide - 1;
	timer.className = 'pea-green-font';
	clear_hometown();
	timer.innerHTML = time_left;
	clearInterval(timer_interval);
	timer_interval = setInterval(function () {
		time_left--;
		timer.innerHTML =  time_left;
		if (time_left > 2) timer.className = 'pea-green-font';
		else timer.className = 'red-font';
		
	}, 1*second);
}


function next_slide () {
	clearInterval(game_interval);
	current_friend_index++;
	update_display();
	game_interval = setInterval(update_display, seconds_per_slide * second);
}

function map_clicked (lat, lon) {
	if (!game_pause) {
		game_pause = true;
		clearInterval(timer_interval);
		net_distance += (get_distance_from_real_hometown(lat, lon));
		console.log((net_distance/1000)+'km');//m to km
		console.log(get_distance_from_real_hometown(lat, lon));
		drop_pin_at_real_hometown();
		display_hometown();
		setTimeout(function () {
			next_slide();
			game_pause = false;
		}, 1 * second);
	}
}

function get_distance_from_real_hometown (lat, lon) {
	return get_distance(lat, lon, friend_data[current_friend_index].hometown_location.latitude, friend_data[current_friend_index].hometown_location.longitude);
}

function drop_pin_at_real_hometown () {
	drop_pin(friend_data[current_friend_index].hometown_location.latitude,
		friend_data[current_friend_index].hometown_location.longitude,
		friend_data[current_friend_index].hometown_location.name,
		3);
}

function display_hometown () {
	var home_town_p = document.getElementById('hometown-display');
	home_town_p.innerHTML = friend_data[current_friend_index].hometown_location.name;
}

function clear_hometown () {
	var home_town_p = document.getElementById('hometown-display');
	home_town_p.innerHTML = '';
}










$(document).keydown(function(e){
	if (e.keyCode == 39) { //right
		next_slide();
	}
});




