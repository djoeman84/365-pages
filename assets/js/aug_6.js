
/*
 *  Classes
 *
 */
 function Drawing (canvas, context) {
 	this.canvas = canvas;
 	this.context = context;

 	//methods
 	this.update = function() {
 		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
 		var dead = [];
 		for (var i = 0; i < balls.length; i++) {
 			ball = balls[i];
 			this.context.beginPath();
 			ball.check_for_bounce();
 			ball.update();
 			if (ball.is_dead()) dead.push(i);//ball.dy = 0;
 			this.context.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI, false);
 			this.context.fillStyle = ball.style;
 			this.context.fill();
 		};
 		
 		for (var i = dead.length -1; i >= 0 ; i--) { //reverse so that array does not collapse on remaining elements
 			balls.splice(dead[i],1);
 		};
 	}
 	this.resize_canvas = function() {
		this.context.canvas.width = window.innerWidth;
		this.context.canvas.height = window.innerHeight;
	}
 }
 function Ball (x, y, r, dx, dy, style) {
 	this.x = x;
 	this.y = y;
 	this.r = r;   //radius
 	this.dx = dx; //movement in x direction
 	this.dy = dy; //movement in y direction
 	this.style = style;
 	
 	//methods
 	this.check_for_bounce = function () {
 		if (bounce((this.x + this.dx) * (-1), 0) || bounce(this.x + this.dx, window.innerWidth)) {
 			this.dx *= (-1)*bounce_factor;
 		}
 		if (bounce(this.y + this.dy, window.innerHeight)) {
 			this.dy *= (-1)*bounce_factor;
 		}
 	}
 	this.update = function () {
 		this.x += this.dx;
 		this.y += this.dy;
 		this.dy += gravity;
 		this.dx *= friction;
 		this.dy *= friction;
 	}
 	this.is_dead = function() {
 		var diff_from_base = window.innerHeight - this.y;
 		return (diff_from_base < dead_ball_height && this.dy < dead_ball_speed);
 	}
 }

 /*
  *  Globals
  *
  */
var balls = [];
var main_drawing;

/*
 *   Physics
 *
 */
var gravity = 0.7;
var friction = 0.999;
var bounce_factor = 0.64;
var dead_ball_height = 1;
var dead_ball_speed = 4;




function mouse_clicked (event) {
	var mouse_x = (event.pageX - $('#main-canvas').offset().left) + $(window).scrollLeft();
	var mouse_y = (event.pageY - $('#main-canvas').offset().left) + $(window).scrollTop();
	add_circle(mouse_x, mouse_y);
}

function add_circle (x, y) {
	var r = 10;
	var dx = 1;
	var dy = 1;
	var style = "green";
	balls.push(new Ball(x,y,r,dx,dy,style));
}

function bounce (object, wall) {
	if (object > wall) return true; //true if object is beyond wall
}


function init_canvas () {
	canvas = document.getElementById('main-canvas');
	context = canvas.getContext('2d');
	main_drawing = new Drawing(canvas, context);
	main_drawing.resize_canvas();
	setInterval(main_drawing.update(), 20);
}

$(window).resize(function (argument) {
	main_drawing.resize_canvas();
})