/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
var rendererOptions = {
	draggable: true
};

var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
var directionsService = new google.maps.DirectionsService();
var map;
var elevator;

var australia = new google.maps.LatLng(-25.274398, 133.775136);

function init_maps () {
	
	var mapOptions = {
		zoom: 7,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: australia
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	directionsDisplay.setMap(map);

	var bikeLayer = new google.maps.BicyclingLayer();
	bikeLayer.setMap(map);

	// Create an ElevationService.
	elevator = new google.maps.ElevationService();

	google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
		update_route(directionsDisplay.directions);
	});
}

function calcRoute(origin, destination, __waypoints__) {
	var waypoints = Array.prototype.slice.call(arguments, 2);
	var waypoints_arr = [];
	for (var i = 0; i < waypoints.length; i++) {
		waypoints_arr.push({location:waypoints[i]});
	};
	var request = {
		origin: origin,
		destination: destination,
		waypoints: waypoints_arr,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	};
	directionsService.route(request, function(response, status) {
	if (status == google.maps.DirectionsStatus.OK) {
		directionsDisplay.setDirections(response);
	}
	});
}


function computeTotalDistance(result, measure) {
	var total = 0;
	var myroute = result.routes[0];
	for (var i = 0; i < myroute.legs.length; i++) {
		total += myroute.legs[i].distance.value;
	}
	switch (measure) {
		case ('miles'):
			return total * (0.000621371);
		case ('km'):
			return total / 1000;
		default:
			return total;
	}
}

var _result;

function update_route (result) {
	_result = result;
	var path = [];
	var distance = 0
	document.getElementById('dist-disp').innerHTML = computeTotalDistance(result, 'miles').toString() + ' miles';
	var routes = result.routes;
	for (var i = 0; i < routes.length; i++) {
		path = path.concat(routes[i].overview_path);
	};
	var pathRequest = {
		'path':path,
		'samples':256
	}
	elevator.getElevationAlongPath(pathRequest, plotElevation);
}

var elev = {'results':undefined,'status':undefined};
function plotElevation (results, status) {
	elev.results = results;
	elev.status = status;
	if (status === 'OK') {
		var data = [];
		for (var i = 0; i < results.length; i++) {
			data.push(results[i].elevation);
		};
		var canvas = document.getElementById('elev-canv');
		var canv_wrap = document.getElementById('elevation-profile')
		var lp = new LinePlot({'canvas':canvas, 'dataPoints':data, 'height':canv_wrap.height, 'width':window.innerWidth});
		lp.plot();
	}
	
}
