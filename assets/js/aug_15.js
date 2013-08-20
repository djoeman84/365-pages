var hirigana_char_max    = 12436;
var hirigana_char_min    = 12353;
var hirigana_range       = hirigana_char_max - hirigana_char_min;
var hirigana_offset_curr = 0;
var string_formatter     = '%s';

var drawing;

var text_rate = 0.3;
var text_fall_rate = 7;

var text_height_min  = 10;
var text_height_max  = 17;
var text_font_format = 'bold %spx Arial';
var text_gap         = 1.3;

var animation_fps = 60;

function init_js () {
	init_canvas();
	init_animate();
}

function init_canvas () {
	drawing = new Drawing('main-canvas');
	drawing.resize();
}

function init_animate () {
	setInterval(function () {
		drawing.draw();
		if (text_rate > Math.random()) drawing.addObject(new Text_Stream());
	}, 1000/animation_fps);
}


function Drawing (canvas_id) {
	this.canvas  = document.getElementById(canvas_id);
	this.context = this.canvas.getContext('2d');
	this.objects = [];

	this.refresh = function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	this.resize = function () {
		this.canvas.width  = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}
	this.draw = function () {
		this.refresh();
		for (var i = this.objects.length - 1; i >= 0; i--) {
			this.objects[i].draw();
			if (this.objects[i].is_dead()) {
				this.objects.splice(i,1);
			}
		};
	}
	this.addObject = function (obj) {
		if(obj) this.objects.push(obj);
		obj.canvas  = this.canvas;
		obj.context = this.context;
		obj.x       = random(0, this.canvas.width);
		obj.y       = 0;
	}
}

function Text_Stream () {
	this.x;
	this.y;

	this.canvas;
	this.context;

	this.font_size = random(text_height_min, text_height_max);
	this.font = text_font_format.replace(string_formatter, this.font_size.toString());

	this.stream_len = random(6,20);
	this.stream = [];
	this.stream_alpha = [];
	for (var i = 0; i < this.stream_len; i++) {
		this.stream.push(String.fromCharCode(random(hirigana_char_min,hirigana_char_max)));
		this.stream_alpha.push(scale(this.font_size - 2*i, text_height_min - 2*this.stream_len, text_height_max, 0.2, 1.0) + scale(Math.random(),0,1,-0.4,0.6));
	};

	this.text_fall_rate = scale(this.font_size,text_height_min,text_height_max,text_fall_rate/2,text_fall_rate);

	this.draw = function () {
		this.context.font = this.font;
		for (var i = 0; i < this.stream.length; i++) {
			this.context.fillStyle = 'rgba(20,200,10,%s)'.replace(string_formatter, this.stream_alpha[i].toString());
			this.context.shadowColor = 'rgba(20,200,10,1)';
			this.context.shadowOffsetX = 0;
			this.context.shadowOffsetY = 0;
			this.context.shadowBlur = 20;
			this.context.fillText(this.stream[i], this.x, this.y - this.font_size * i * text_gap);
		};
		

		this.y += this.text_fall_rate;
	}
	this.is_dead = function () {
		return (this.y - (this.font_size * (this.stream_len)) * text_gap) > this.canvas.height;
	}
}


function random (min, max) {
	var range = (max + 1) - min;
	return Math.floor(Math.random()*range + min);
}


function scale (val, in_min, in_max, target_min, target_max) {
	return ((val - in_min) / (in_max - in_min)) * (target_max - target_min) + target_min;
}



$(window).resize(function () {
	drawing.resize();
})