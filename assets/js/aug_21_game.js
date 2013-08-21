var friend_data;
var game_interval;

var seconds_per_slide = 10;

function init_game () {
	displayId('game-box-left');
	displayId('game-box-right');

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
	var i = 1;
	update_display(0);
	game_interval = setInterval(function () {
		update_display(i);
	}, seconds_per_slide * 1000);
}

function update_display (i) {
	FB.api('/'+friend_data[i].uid+'?fields=picture.width(200).height(200)', function (r) {
		setImgSrc('jumbo-friend-pic', r.picture.data.url);
	});
	document.getElementById('friend-profile-anchor').innerHTML = friend_data[i].name;
	i++;
	if (i === friend_data.length) {
		shuffle(friend_data);
		i = 0;
	}
}