var canvas;
var context;

var mouse_x = -1;
var mouse_y = -1;

var num_ducks = 10 + 1;
var ducks = [];

var approach_rate = 4;



$(document).ready(function () {
	init_canvas();
	$('#main-canvas').mousemove(function (e) {
		mouse_x = e.clientX;
		mouse_y = e.clientY;
	});
});

$(window).resize(function () {
	resize_canvas();
});



function resize_canvas () {
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
}

function init_canvas () {
	canvas = document.getElementById('main-canvas');
	context = canvas.getContext('2d');
	resize_canvas();
	init_ducks();
	setInterval(function () {
		if(ducks.length) {
			context.clearRect(0, 0, canvas.width, canvas.height);
			ducks[0].x = mouse_x;
			ducks[0].y = mouse_y;
			for (var i = 1; i < ducks.length; i++) {
				if (ducks[i].x === -1 && mouse_x !== -1) {
					ducks[i].x = mouse_x;
					ducks[i].y = mouse_y;
				}
				var prev_x = ducks[i-1].x;
				var prev_y = ducks[i-1].y;
				
				var diff_x = prev_x - ducks[i].x;
				var diff_y = prev_y - ducks[i].y;

				if (diff_x > 0) ducks[i].dir = 'right';
				else ducks[i].dir = 'left';

				if (Math.sqrt(Math.pow(diff_x,2) + Math.pow(diff_y,2)) > 3 * ducks[i].radius) {
					ducks[i].x += diff_x/approach_rate;
					ducks[i].y += diff_y/approach_rate;
				}
				
				

				ducks[i].draw();
			};
		}
	}, 30);
}




/*
 *  Ducks
 *
 */
function Duck () {
	this.x = -1;
	this.y = -1;
	this.radius = 10;

	this.dir = 'right';	

	this.draw = function () {
		context.beginPath();

		if (this.dir === 'left') {
			context.arc(this.x,this.y, this.radius,1.5*Math.PI,1.15*Math.PI);
			context.lineTo(this.x-this.radius, this.y-this.radius);
			context.lineTo(this.x,this.y-this.radius);
		} else if (this.dir === 'right') {
			context.arc(this.x,this.y, this.radius,1.5*Math.PI,1.85*Math.PI, true);
			context.lineTo(this.x+this.radius, this.y-this.radius);
			context.lineTo(this.x,this.y-this.radius);
		}
		
		context.fillStyle = 'yellow';
		context.fill();

		context.beginPath();
		context.arc(this.x, this.y - this.radius/2, this.radius/8, 0,2*Math.PI);
		context.fillStyle = 'black';
		context.fill();
	};
}



function init_ducks () { //duck 0 = mouse
	for (var i = 0; i < num_ducks; i++) {
		ducks[i] = new Duck();
	};
}