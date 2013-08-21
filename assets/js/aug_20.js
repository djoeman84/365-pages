var friend_data;
var g_map;
var g_map_overlay;
var custom_map_id = 'simple';
var check_signed_in;


function init_js () {
	update_display();
	init_google_maps();
	check_signed_in = setInterval(update_display, 500);
}

function init_google_maps () {
	var featureOpts = [
		{
			stylers: [
				{ hue        : '#E0FFFF'},
				{ visibility : 'simplified'},
				{ gama       : 0.5},
				{ weight     : 0.3}
			]
		}
	];
	var mapOptions = {
		zoom:3,
		center: new google.maps.LatLng(39, -37),
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, custom_map_id]
		},
		mapTypeId: custom_map_id
	};

	g_map = new google.maps.Map(document.getElementById('google-maps-canvas'), mapOptions);

	var styledMapOptions = {
		name: 'Simple'
	};

	var customMapType = new google.maps.StyledMapType(featureOpts,styledMapOptions);
	g_map.mapTypes.set(custom_map_id, customMapType);

	google.maps.event.addListener(g_map, 'click', function (event) {
		if (friend_data) {
			var latLng  = event.latLng;
			friend_data.sort(function (a, b) {
				var distA = google.maps.geometry.spherical.computeDistanceBetween (
					new google.maps.LatLng(a.hometown_location.latitude,a.hometown_location.longitude), 
					latLng);
				var distB = google.maps.geometry.spherical.computeDistanceBetween (
					new google.maps.LatLng(b.hometown_location.latitude,b.hometown_location.longitude), 
					latLng);
				return distA - distB;
			})
			var nearest_ul = document.getElementById('left-hud-ul');
			nearest_ul.innerHTML = '';
			for (var i = 0; i < 5; i++) {
				var nearest_li = document.createElement('li');
				var nearest_a  = document.createElement('a');
				nearest_a.href = 'https://www.facebook.com/'+friend_data[i].uid;
				nearest_a.innerHTML = friend_data[i].name;
				nearest_li.innerHTML = ': '+friend_data[i].hometown_location.name;
				nearest_li.id = 'left-hud-li';
				nearest_li.insertBefore(nearest_a, nearest_li.firstChild);
				nearest_ul.appendChild(nearest_li);
			};
		}
	})

}


function update_display () {
	//username for banner
	FB.api('/me', function(response) {
		if(response.name === undefined) {
			document.getElementById('welcome').innerHTML = '';
			document.getElementById('login').innerHTML = 'login';
			document.getElementById('logout').innerHTML = '';
			document.getElementById('find-friends-div').style.display = 'none';
		} else {
			clearInterval(check_signed_in)
			document.getElementById('welcome').innerHTML = response.name;
			document.getElementById('login').innerHTML = '';
			document.getElementById('logout').innerHTML = 'logout';
			document.getElementById('find-friends-div').style.display = 'block';
		}
		
	});
}

function run_query () {
	FB.api('/fql?q='+escape('SELECT uid,name,hometown_location FROM user WHERE uid IN (SELECT uid1 FROM friend WHERE uid2 = me())'),function(r){
		var heatmapData = [];
		friend_data = r.data;
		for (var i = friend_data.length - 1; i >= 0; i--) {
			if (friend_data[i].hometown_location) {
				heatmapData.push(new google.maps.LatLng(friend_data[i].hometown_location.latitude, friend_data[i].hometown_location.longitude));
			} else {
				friend_data.splice(i,1);
			}
		};
		var heatmap = new google.maps.visualization.HeatmapLayer({
			data:heatmapData, opacity:1, radius:50
		});
		heatmap.setMap(g_map);
	});
}


function login(){
	FB.login(function (response) {
		console.log('logged in');
		update_display();
	},{scope:'friends_hometown'});
}

function logout () {
	FB.logout(function (response) {
		console.log('logged out');
		update_display();
	});
}