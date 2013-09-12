/*
	365-pages by Joe Delgado. github.com/djoeman84
*/


function LinePlot (settings) {
	var _settings = settings;

	var _canvas     = settings.canvas;
	var _dataPoints = settings.dataPoints;

	

	function get_extremes (arr) {
		var min, max;
		for (var i = 0; i < arr.length; i++) {
			if (min === undefined || arr[i] < min) {
				min = arr[i];
			}
			if (max === undefined || arr[i] > max) {
				max = arr[i];
			}
		};
		return {'min':min, 'max':max};
	}

	this.toString = function () {
		return _dataPoints;
	}
	this.setHeight = function (height) {
		_canvas.height = height;
	}
	this.setWidth = function (width) {
		_canvas.width = width;
	}

	this.plot = function () {
		var ctx = _canvas.getContext("2d");
		ctx.clearRect(0,0,_canvas.width,_canvas.height);
		var extremes = get_extremes(_dataPoints);
		var diff     = extremes.max - extremes.min;


		//measurements
		var graph_coord = {'left':_canvas.width/8,
							'right':(_canvas.width - _canvas.width/8),
							'top':_canvas.height/5,
							'bottom':(_canvas.height - _canvas.height/5)};

		var g_width = graph_coord.right - graph_coord.left;
		var g_height = graph_coord.bottom - graph_coord.top;

		ctx.beginPath();

		for (var i = 0; i < _dataPoints.length; i++) {
			var x = (i/_dataPoints.length)*g_width + graph_coord.left;
			var y = graph_coord.bottom - ((_dataPoints[i] - extremes.min)/diff)*g_height;
			if (i===0) ctx.moveTo(x,y);
			else ctx.lineTo(x,y);
		};

		ctx.stroke();
	}

	function _init (obj) {
		if(_settings.height) obj.setHeight(_settings.height);
		if(_settings.width)  obj.setWidth(_settings.width);
	}
	_init(this);
}