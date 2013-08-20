var drawing;
var motion;

var Orientation  = {
	None         :   0,
	Left         :  90,
	Right        : -90,
	Upside_Down  : 180
};



window.ondevicemotion = function (event) {
	motion.set(event.accelerationIncludingGravity.x,
				event.accelerationIncludingGravity.y,
				event.accelerationIncludingGravity.z);
}

// Listen for orientation changes
window.addEventListener("orientationchange", function() {
	init_canvas();
}, false);



function init_js () {
	init_motion();
	init_canvas();
	init_interval();
}

function init_motion () {
	motion = new Motion_Obj();
}

function init_canvas () {
	drawing = new Drawing('main-canvas');
	drawing.resize();
	var main_ball = new Ball();
	drawing.addObject(main_ball);
}

function init_interval () {
	setInterval(function () {
		drawing.draw();
	}, 15);
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
		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].draw();
		};
	}
	this.addObject = function (obj) {
		if(obj) this.objects.push(obj);
		obj.canvas  = this.canvas;
		obj.context = this.context;
		obj.x       = this.canvas.width/2;
		obj.y       = this.canvas.height/2;
	}
}


function Ball () {
	this.x = 0;
	this.y = 0;
	this.radius = 20;
	this.speed  = 5;

	this.canvas;
	this.context;

	this.draw = function () {
		//if (motion.x > 0) {var next_x = this.x + Math.pow(motion.x,2) * this.speed;}
		//else              {var next_x = this.x - Math.pow(motion.x,2) * this.speed;}
		//if (motion.y > 0) {var next_y = this.y + Math.pow(motion.y,2) * this.speed;}
		//else              {var next_y = this.y - Math.pow(motion.y,2) * this.speed;}

		var next_x = this.x + motion.x * this.speed;
		var next_y = this.y + motion.y * this.speed;

		if (next_x > 0 && next_x < this.canvas.width) {
			this.x = next_x;
		}
		if (next_y > 0 && next_y < this.canvas.height) {
			this.y = next_y;
		}

		this.context.beginPath();
		this.context.arc(this.x, this.y,this.radius,0,Math.PI*2);
		this.context.fill();
	}
}

function Motion_Obj () {
	this.x;
	this.y;
	this.z;

	this.set = function (x,y,z) {
		switch(window.orientation) {
			case Orientation.None:
				this.x = x;
				this.y = -y;
				this.z = z;
				break;
			case Orientation.Left:
				this.x = -y;
				this.y = -x;
				this.z = z;
				break;
			case Orientation.Right:
				this.x = y;
				this.y = x;
				this.z = z;
				break;
			case Orientation.Upside_Down:
				this.x = -x;
				this.y = y;
				this.z = z;
				break;
		}
	}
}