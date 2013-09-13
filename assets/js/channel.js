function GAEChannel (api, key, callback) {
	try {
		var temp = goog;
	}
	catch (err) {
		console.log('Missing Dependency: please add <script src="/_ah/channel/jsapi" type="text/javascript"></script> to your html document');
	}
	var gaeChannel_obj = this;
	this.key = key;
	this.callback = callback;
	this.id;
	this.api_url = '../channelAPI?api='+api+'&key='+key

	this.subscribe = function (completionFn) {
		var xmlhttp;
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp= new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				var data = JSON.parse(xmlhttp.responseText);
				gaeChannel_obj.id = data.channel_id;
				var channel = new goog.appengine.Channel(gaeChannel_obj.id);
				var socket = channel.open();
				socket.onmessage = gaeChannel_obj.callback;
				if (completionFn) completionFn();
			}
		}
		xmlhttp.open("GET", gaeChannel_obj.api_url, true);
		xmlhttp.send();
	}
	this.post = function (json_obj, callback) {
		var request = new XMLHttpRequest();
		request.open("POST", gaeChannel_obj.api_url);
		request.setRequestHeader("Content-Type", "application/json");
		request.overrideMimeType("text/plain");
		request.onload = callback;
		request.send(JSON.stringify(json_obj));
	}
}