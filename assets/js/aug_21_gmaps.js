var g_map;
var click;

function init_google_maps () {
	var mapOptions = {
		zoom:2,
		center: new google.maps.LatLng(22.479597104945974, -42.97656250000001),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	g_map = new google.maps.Map(document.getElementById('google-maps-canvas'),
      mapOptions);

	google.maps.event.addListener(g_map, 'click', function (event) {
		console.log(event);
		click = event;
		map_clicked(event.latLng.lat(), event.latLng.lng());
	});

}


function get_distance (latA, lonA, latB, lonB) {
	return google.maps.geometry.spherical.computeDistanceBetween (
		new google.maps.LatLng(latA, lonA),
		new google.maps.LatLng(latB, lonB)
	);
}

function check_map_resize () {
	google.maps.event.trigger(g_map, 'resize');
}

function center_map () {
	g_map.panTo(new google.maps.LatLng(22.479597104945974, -42.97656250000001));
}

function drop_pin (lat, lon, title, remove_after) {
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, lon),
		map: g_map,
		title: title
	});
	if (remove_after) {
		setTimeout(function () {
			marker.setMap(null);
		}, remove_after * second);
	}
}