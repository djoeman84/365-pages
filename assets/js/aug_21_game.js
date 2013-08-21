var friend_data;
var game_interval;
var timer_interval;
var current_friend_index;

var seconds_per_slide = 10;

function init_game () {
	displayId('game-box-left');
	displayId('game-box-right');
	check_map_resize();
	center_map();

	query_fb_for_friends();
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
	var time_left = seconds_per_slide;
	timer.className = 'pea-green-font';
	timer.innerHTML = time_left;
	clearInterval(timer_interval);
	timer_interval = setInterval(function () {
		time_left--;
		timer.innerHTML =  time_left;
		if (time_left > 6) timer.className = 'pea-green-font';
		else if (time_left > 2) timer.className = 'yellow-font';
		else timer.className = 'red-font';
		
	}, 1*second);
}


function map_clicked (lat, lon) {
	var dist = get_distance_from_real_hometown(lat, lon);
	console.log('dist: '+dist);
	drop_pin_at_real_hometown();
}

function get_distance_from_real_hometown (lat, lon) {
	return get_distance(lat, lon, friend_data[current_friend_index].hometown_location.latitude, friend_data[current_friend_index].hometown_location.longitude);
}

function drop_pin_at_real_hometown () {
	drop_pin(friend_data[current_friend_index].hometown_location.latitude,
		friend_data[current_friend_index].hometown_location.longitude,
		friend_data[current_friend_index].hometown_location.name,
		5);
}