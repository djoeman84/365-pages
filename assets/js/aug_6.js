
/*
 *  Classes
 *
 */
 function Drawing (canvas, context) {
 	this.canvas = canvas;
 	this.context = context;
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
var canvas;
var context;
var balls_remain = false;
var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF", "#996699", "#99CCFF", "#FFCC66", "#FF99FF", "#33CCFF"];
var launch_dx = 0;
var launch_dy = 0;

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

function random_color() {
	return colors[Math.floor(Math.random() * colors.length)]
}

function random_r() {
	return (Math.random() * 20) + 10;
}

function add_circle (x, y) {
	var r = random_r();
	var style = random_color();
	balls.push(new Ball(x,y,r,launch_dx,launch_dy,style));
}

function resize_canvas () {
	context.canvas.width = window.innerWidth;
	context.canvas.height = window.innerHeight;
}

function bounce (object, wall) {
	if (object > wall) return true; //true if object is beyond wall
}

function update_canvas () {
	context.clearRect(0, 0, canvas.width, canvas.height);
	var dead = [];
	for (var i = 0; i < balls.length; i++) {
		ball = balls[i];
		context.beginPath();
		ball.check_for_bounce();
		ball.update();
		if (ball.is_dead()) {
			if (balls_remain) ball.dy = 0;
			else dead.push(i);
		}
		context.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI, false);
		context.fillStyle = ball.style;
		context.fill();
	};
	
	for (var i = dead.length -1; i >= 0 ; i--) { //reverse so that array does not collapse on remaining elements
		balls.splice(dead[i],1);
	};
}

function init_canvas () {
	canvas = document.getElementById('main-canvas');
	context = canvas.getContext('2d');
	resize_canvas();
	setInterval(update_canvas, 20);
}

function check_clicked() {
	balls_remain = $("#balls-remain").is(':checked')
	if ($("#gravity-check").is(':checked')) {
		gravity = 0.0;
	} else {
		gravity = 0.7;
	}
	if ($("#friction-check").is(':checked')) {
		friction = 1.0;
		bounce_factor = 1.0;
	} else {
		friction = 0.999;
		bounce_factor = 0.64;
	}
}

$(window).resize(function (argument) {
	resize_canvas();
})

$(document).keydown(function(e){
    if (e.keyCode == 37) { //left
       launch_dx--;
    } 
    else if (e.keyCode == 38) { //up
       launch_dy--;
    }
    else if (e.keyCode == 39) { //right
       launch_dx++;
    }
    else if (e.keyCode == 40) { //down
       launch_dy++;
    }
    $("#up-metric").html((-1)*launch_dy);
    $("#lr-metric").html(launch_dx);
});