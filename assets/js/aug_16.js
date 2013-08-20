var g_map;
var request;


function init_js () {
	init_google_maps();
}

function init_google_maps () {
	var mapOptions = {
		zoom:15,
		center: new google.maps.LatLng(33.8098235688665, -117.92057079696654),
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};

	 g_map = new google.maps.Map(document.getElementById('google-maps-canvas'),
      mapOptions);
}


function xml_req () {
	var invocation = new XMLHttpRequest();
	var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=romney&facet_field=day_of_week&begin_date=20120101&end_date=20120101&api-key=b1ee2e9937cc362be3892ed1e2ea0eff:0:58566570';
	invocation.open('GET',url, true);
	invocation.onreadystatechange = handler;
	invocation.send();
}
