/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
var drawing;
var gaeChannel;
var gaeActive = false;
function init_js () {
	gaeChannel = new GAEChannel('draw','general', new_line_from_server);
	gaeChannel.subscribe(function () {
		gaeActive = true;
	});
	drawing = new Drawing(document.getElementById('main-canvas'));
	drawing.resize();
}

function resize () {
	if (drawing) drawing.resize();
}

var drag = undefined;
function canvas_mousedown (e) {
	if (drawing) {
		var rect = drawing.canvas.getBoundingClientRect();
		var pt = {'x':e.clientX - rect.left,'y':e.clientY - rect.top};
		if (!drag) {
			drag = [pt];
			drawing.lines.push(drag);
			drawing.draw();
		} else {
			drag = undefined;
		}
	}
}

function canvas_mousemove (e) {
	if (drawing) {
		var rect = drawing.canvas.getBoundingClientRect();
		var pt = {'x':e.clientX - rect.left,'y':e.clientY - rect.top};
		if (drag) {
			drag.push(pt);
			drawing.draw();
		}
	}
}

function canvas_mouseup (e) {
	if (drawing) {
		var rect = drawing.canvas.getBoundingClientRect();
		var pt = {'x':e.clientX - rect.left,'y':e.clientY - rect.top};
		if (drag) {
			drag.push(pt);
			drawing.draw();
			var old_drag = drag;
			drag = undefined;
			
			if (gaeActive) {
				gaeChannel.post({'sender':gaeChannel.id,'method':'addLine','line':old_drag});
			}
		}
	}
}

function new_line_from_server (data) {
	var json_data = JSON.parse(data.data);
	switch(json_data.method){
		case ('addLine'):
			if (json_data.sender !== gaeChannel.id) {
				drawing.lines.push(json_data.line);
				drawing.draw();
			}
			break;
		case ('clear'):
			drawing.clear();
			drawing.draw();
			break;
	}
}

function clear_canvas () {
	gaeChannel.post({'method':'clear'});
	drawing.clear();
	drawing.draw();
}





function Drawing (canvas) {
	this.canvas = canvas;
	this.context = canvas.getContext('2d');
	this.lines = [];

	this.resize = function () {
		this.canvas.width  = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	this.draw = function () {
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
		for (var i = 0; i < this.lines.length; i++) {
			var points = this.lines[i];
			this.context.beginPath();
			for (var n = 0; n < points.length; n++) {
				if  (n === 0) {
					this.context.moveTo(points[n].x, points[n].y);
				} else {
					this.context.lineTo(points[n].x, points[n].y);
				}
			};
			this.context.stroke();
		};
	}
	this.clear = function () {
		this.lines = [];
	}
}