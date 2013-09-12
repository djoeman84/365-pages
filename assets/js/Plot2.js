/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
function LineGraph (div, settings) {
	/* global variables */
	this.settings;
	this.data;
	this.canvas;
	this.div;
	this.extremes;
	this.drawing;
	this.mouse_drag = {'active':false};

	/* first run */
	this.init = function (div, settings) {
		this.settings = (settings || {});

		this.div = div;
		if (!this._div_is_properly_formatted(this.div)) return;
		this.div.appendChild(this._populate_div());
		var this_obj = this;
		window.onresize = function () {
			this_obj._resize_canvas();
			this_obj.plot();
		}
	}

	/* Private methods */
	this.default = function (type) {
		switch (type) {

		}
	}
	this._error = function (type, message) {
		switch (type) {
			case ('argument'):
				console.log('Argument Error: '+message);
				break;
			case ('arg-type'):
				console.log('Argument Type Error: '+message);
				break;
		}
	}
	this._populate_div = function () {
		this.canvas = document.createElement('canvas');
		this._resize_canvas();
		return this.canvas;
	}
	this._div_is_properly_formatted = function (div) {
		if (!div) {
			this._error('argument', 'LineGraph initialization requires div parameter');
			return false;
		}
		if (!(div.tagName === 'DIV')) {
			this._error('arg-type', 'LineGraph initialization requires div (DOM) element parameter');
			return false;
		}
		return true;
	}
	this._resize_canvas = function () {
		this.canvas.width = this.div.clientWidth;
		this.canvas.height = this.div.clientHeight;
	}
	this._get_extremes = function (data) {
		var x_min, x_max, y_min, y_max;
		for (var i = 0; i < data.length; i++) {
			if (x_min === undefined || x_min > data[i].x) x_min = data[i].x;
			if (x_max === undefined || x_max < data[i].x) x_max = data[i].x;
			if (y_min === undefined || y_min > data[i].y) y_min = data[i].y;
			if (y_max === undefined || y_max < data[i].y) y_max = data[i].y;
		};
		return {'x':{'min':x_min,'max':x_max}, 'y':{'min':y_min,'max':y_max}}
	}

	this.addData = function (data) {
		this.data = data;
		this.extremes = this._get_extremes(this.data.pts);
	}
	this.appendData = function (data) {
		if (!this.data.pts) this.data.pts = [];
		this.data.pts = this.data.pts.concat(data.pts);
		this.extremes = this._get_extremes(this.data.pts);
	}
	this.plot = function () {
		if (this.data.pts && this.data.pts.length) {
			this.drawing = new LineGraphDrawing({'canvas':this.canvas, 'data':this.data, 'extremes':this.extremes, 'edge':{'left':0.1, 'bottom':0.1, 'top':0.1, 'right':0.1}});
			this.drawing.draw();
			var this_obj = this;
			this.canvas.addEventListener('mousemove', function (e) {
				this_obj.mousemove(e);
			}, false);
			this.canvas.addEventListener('mousedown', function (e) {
				var rect = this_obj.canvas.getBoundingClientRect();
				this_obj.mouse_drag = {'start':{'x':e.clientX - rect.left,'y':e.clientY - rect.top},'active':true};
			}, false);
			this.canvas.addEventListener('mouseup', function (e) {
				this_obj.mouse_drag.active = false;
			}, false);
		}
	}
	this.mousemove = function (e, mouse_drag) {
		if (this.drawing) {
			var rect = this.canvas.getBoundingClientRect();
			if (this.mouse_drag.active) {
				this.mouse_drag.end = {'x':e.clientX - rect.left,'y':e.clientY - rect.top};
			}
			this.drawing.draw_with_point({'x':e.clientX - rect.left,'y':e.clientY - rect.top});
			if (this.mouse_drag.start && this.mouse_drag.end) {
				this.drawing.draw_with_selection(this.mouse_drag.start, this.mouse_drag.end);
			}
		}
	}
	this.init(div, settings);
}


function LineGraphDrawing (settings) {
	this.settings = init_settings(settings);
	this.canvas = settings.canvas;
	this.data = settings.data;
	this.extremes = settings.extremes;
	this.edge = settings.edge;

	this.context = this.canvas.getContext('2d');


	function init_settings (settings) {
		settings.data = (settings.data || {'pts':[]});
		settings.edge = (settings.edge || {'left':0.1, 'bottom':0.1, 'top':0.1, 'right':0.1});
		settings.body_dash = (settings.body_dash || true);
		settings.dash_style = (settings.dash_style || [10,2]);
		settings.bodyStrokeStyle = (settings.bodyStrokeStyle || 'rgb(255,100,100)');
		settings.bodyFillStyle = (settings.bodyFillStyle || 'rgba(255,100,100, 0.9)');
		settings.pointFillStyle = (settings.pointFillStyle || 'rgb(150,200,255)');
		settings.pointStrokeStyle = (settings.pointStrokeStyle || 'rgba(150,200,255, 0.4)');
		settings.selectionFillStyle = (settings.selectionFillStyle || 'rgba(150,200,255, 0.7)');
		settings.metricFillStyle = (settings.metricFillStyle || 'rgb(150,200,255)');
		return settings;
	}
	this.draw = function () {
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
		this._draw_graph();
		this._draw_axes();
	}
	this.draw_with_point = function (pt) {
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
		this._draw_graph();
		this._draw_axes();
		this._draw_point(pt);
	}
	this.draw_with_selection = function (pt_start, pt_end) {
		this._draw_selection(pt_start, pt_end);
	}
	this._draw_axes = function () {
		this._draw_y_axis();
		this._draw_x_axis();
	}
	this._draw_y_axis = function () {
		var dimensions = {'width':this.canvas.width  * this.edge.left,
							'height':this.canvas.height * (1 - this.edge.bottom - this.edge.top)};
		var origin = {'x':0,'y':this.canvas.height * this.edge.top};

		this.context.beginPath();
		this.context.moveTo(origin.x + dimensions.width, origin.y);
		this.context.lineTo(origin.x + dimensions.width, origin.y + dimensions.height);
		this.context.stroke();
	}
	this._draw_x_axis = function () {
		var dimensions = {'width':this.canvas.width  * (1 - this.edge.left - this.edge.right),
							'height':this.canvas.height * (this.edge.bottom)};
		var origin = {'x':this.canvas.width * this.edge.left,
						'y':this.canvas.height * (1 - this.edge.bottom)};


		this.context.beginPath();
		this.context.moveTo(origin.x, origin.y);
		this.context.lineTo(origin.x + dimensions.width, origin.y);
		this.context.stroke();
	}
	this._draw_graph = function () {
		var data = this.data.pts;
		var dimensions = {'width':this.canvas.width  * (1 - this.edge.left - this.edge.right),
							'height':this.canvas.height * (1 - this.edge.bottom - this.edge.top)};
		var origin = {'x':this.canvas.width * this.edge.left,
						'y': this.canvas.height * this.edge.top};

		this.context.beginPath();
		this.context.moveTo(origin.x, origin.y + dimensions.height);
		for (var i = 0; i < data.length; i++) {
			var pt = this._translate_data_to_canvas_pt(data[i], dimensions, origin);
			this.context.lineTo(pt.x,pt.y);
		};
		this.context.lineTo(origin.x + dimensions.width, origin.y + dimensions.height);
		this.context.closePath();
		this.context.lineWidth = 2;
		if (this.settings.body_dash) {
			this.context.setLineDash(this.settings.dash_style);
		}
		this.context.strokeStyle = this.settings.bodyStrokeStyle;
		this.context.fillStyle = this.settings.bodyFillStyle;
		this.context.fill();
		this.context.stroke();

		this.context.setLineDash([1,0]);
	}
	this._draw_point = function (pt) {
		var dimensions = {'width':this.canvas.width  * (1 - this.edge.left - this.edge.right),
							'height':this.canvas.height * (1 - this.edge.bottom - this.edge.top)};
		var origin = {'x':this.canvas.width * this.edge.left,
						'y': this.canvas.height * this.edge.top};

		var prj_pt = this.get_projection_pt(pt, origin, dimensions);

		var px_pt = this._translate_data_to_canvas_pt(prj_pt, dimensions, origin);

		this.context.beginPath();
		this.context.fillStyle = this.settings.pointFillStyle;
		this.context.arc(px_pt.x, px_pt.y, 4, 0, Math.PI * 2);
		this.context.fill();

		this.context.beginPath();
		this.context.strokeStyle = this.settings.pointStrokeStyle;
		this.context.moveTo(origin.x, px_pt.y);
		this.context.lineTo(px_pt.x, px_pt.y);
		this.context.lineTo(px_pt.x, origin.y + dimensions.height);
		this.context.stroke();

		this.context.font = 'bold 16px Arial';
		var units = {'x':'','y':''};
		if (this.data.units) {
			if (this.data.units.x) units.x = (this.data.units.x).toString();
			if (this.data.units.y) units.y = (this.data.units.y).toString();
		}
		this.context.fillStyle = this.settings.metricFillStyle;
		this.context.fillText(prj_pt.x.toString() + ' ' + units.x, px_pt.x, origin.y + dimensions.height);
		this.context.fillText(prj_pt.y.toString() + ' ' + units.y, origin.x, px_pt.y);
	}
	this._draw_selection = function (pt_start, pt_end) {
		var data = this.data.pts.sort(function (a, b) {
			return a.x - b.x;
		});
		var dimensions = {'width':this.canvas.width  * (1 - this.edge.left - this.edge.right),
							'height':this.canvas.height * (1 - this.edge.bottom - this.edge.top)};
		var origin = {'x':this.canvas.width * this.edge.left,
						'y': this.canvas.height * this.edge.top};

		var prj_pt_start = this.get_projection_pt(pt_start, origin, dimensions);
		var prj_pt_end   = this.get_projection_pt(pt_end  , origin, dimensions);

		if (prj_pt_start.x > prj_pt_end.x) {
			var temp = prj_pt_start;
			prj_pt_start = prj_pt_end;
			prj_pt_end = temp;
		}

		var start = this._translate_data_to_canvas_pt(prj_pt_start, dimensions, origin);
		var end   = this._translate_data_to_canvas_pt(prj_pt_end  , dimensions, origin);



		this.context.beginPath();
		this.context.moveTo(start.x, origin.y + dimensions.height);
		this.context.lineTo(start.x, start.y);
		for (var i = prj_pt_start.right; i <= prj_pt_end.left; i++) {
			var pt = this._translate_data_to_canvas_pt(data[i], dimensions, origin);
			this.context.lineTo(pt.x,pt.y);
		};
		this.context.lineTo(end.x, end.y);
		this.context.lineTo(end.x, origin.y + dimensions.height);
		this.context.closePath();
		this.context.fillStyle = this.settings.selectionFillStyle;
		this.context.fill();
	}
	this._translate_data_to_canvas_pt = function (pt, dimensions, origin) {
		return {'x':origin.x + (normalize_float(pt.x,this.extremes.x.min,this.extremes.x.max) * dimensions.width),
				'y':origin.y + dimensions.height - (normalize_float(pt.y,this.extremes.y.min,this.extremes.y.max) * dimensions.height)};
	}

	this.get_projection_pt = function(pt, origin, dimensions) {
		var x = normalize_float(pt.x, origin.x, origin.x + dimensions.width);
		var projected_x = scale(x, this.extremes.x.min, this.extremes.x.max);
		var y_i = closest_elem (this.data.pts, {'x':projected_x}, false, function (a, b) {
			return (a.x - b.x);
		});

		if (y_i === 0 || y_i === this.data.pts.length - 1 || this.data.pts[y_i].x === projected_x) {
			var left = y_i, right = y_i;
			var y = this.data.pts[y_i];
		} else if (this.data.pts[y_i].x > projected_x) {
			var left = y_i - 1, right = y_i;
			var diff = this.data.pts[y_i].x - this.data.pts[y_i - 1].x;
			var y = this.data.pts[y_i - 1].y * (1 - ((projected_x - this.data.pts[y_i - 1].x)/diff)) +
				this.data.pts[y_i].y * (1 - ((this.data.pts[y_i].x - projected_x)/diff));
		} else if (this.data.pts[y_i].x < projected_x){
			var left = y_i, right = y_i - 1;
			var diff = this.data.pts[y_i + 1].x - this.data.pts[y_i].x;
			var y = this.data.pts[y_i].y * (1 - (projected_x - this.data.pts[y_i].x)/diff) +
				this.data.pts[y_i + 1].y * (1 - ((this.data.pts[y_i + 1].x - projected_x)/diff));
		}
		var x = ((projected_x >= this.data.pts[0].x) && (projected_x <= this.data.pts[this.data.pts.length - 1].x))
				? projected_x : NaN ;
		return {'x':x, 'y':y,'left':left,'right':right};
	}
}




