var angle = 0;

var anglers = [];
var num_ang_to_ang = {};
var colors = ['red','blue','green','orange','yellow'];

var timer;

/*
 *  Init
 *
 */
function init_js () {
	for (var i = 1; i < 7; i++) {
		add_canvas(i);
	};
	init_timer();
}



/*
 *  Classes
 *
 */
 function Angler (canvas, num_sides) {
 	this.num_sides = num_sides;
 	this.canvas  = canvas;
 	this.context = canvas.getContext('2d');

 	this.radius = canvas.height/3;
 	this.center_x = this.radius * 1.5;
 	this.center_y = canvas.height/2;

 	this.points = [];

 	this.draw = function (i) {
 		this.context.clearRect(0,0,this.canvas.width, this.canvas.height);

 		switch(this.num_sides) {
 			case 1:
 				//draw shape
 				this.context.beginPath();
 				this.context.arc(this.center_x, this.center_y, this.radius, 0, 2*Math.PI);
 				this.context.strokeStyle = 'gray';
 				this.context.stroke();

 				//find point
 				var x = this.center_x + this.radius * Math.cos(angle);
 				var y = this.center_y + this.radius * Math.sin(angle);
 				break;
 			case 2:
 				//draw shape
 				this.context.beginPath();
 				this.context.moveTo(this.center_x, this.center_y-this.radius);
 				this.context.lineTo(this.center_x, this.center_y+this.radius);
 				this.context.strokeStyle = 'gray';
 				this.context.stroke();

 				//find point
 				var x = this.center_x;
 				if (angle < Math.PI * 0.5) {
 					var y = this.center_y + (2*angle * this.radius)/Math.PI;
 				} else if(angle >= Math.PI * 0.5 && angle < Math.PI * 1.5) {
 					var y = this.center_y + this.radius - ((angle - 0.5 * Math.PI)*2 * this.radius)/Math.PI;
 				} else {
 					var y = this.center_y - this.radius + ((angle - 1.5*Math.PI)*2 * this.radius)/Math.PI;
 				}
 			
 				break;
 			default:
	 			var top  = 0;
	 			var step = (2/this.num_sides)*(Math.PI);

	 			//draw shape
	 			this.context.beginPath();
	 			this.context.moveTo(this.center_x + this.radius * Math.cos(top - step), this.center_y + this.radius * Math.sin(top - step));
	 			for (var i = 0; i < this.num_sides; i++) {
	 				this.context.lineTo(this.center_x + this.radius * Math.cos(top + i*step), this.center_y + this.radius * Math.sin(top + i*step));
	 			};
	 			this.context.strokeStyle = 'gray';
	 			this.context.stroke();

	 			//define lines
	 			var x_angle1 = this.center_x + this.radius * Math.cos(angle),  y_angle1 = this.center_y + this.radius * Math.sin(angle);
	 			var x_angle2 = this.center_x,                                  y_angle2 = this.center_y;

	 			var Aa = y_angle2 - y_angle1;
 				var Ba = x_angle1 - x_angle2;
 				var Ca = Aa*x_angle1 + Ba*y_angle1;

	 			for (var i = 0; i < this.num_sides; i++) {
	 				if (angle > top + i*step && angle < top + (i+1)*step) {
	 					var x1 = this.center_x + this.radius * Math.cos(top + i*step),     y1 = this.center_y + this.radius * Math.sin(top + i*step);
	 					var x2 = this.center_x + this.radius * Math.cos(top + (i+1)*step), y2 = this.center_y + this.radius * Math.sin(top + (i+1)*step);

	 					var A1 = y2 - y1;
	 					var B1 = x1 - x2;
	 					var C1 = A1*x1 + B1*y1;

	 					var det1 = A1*Ba - Aa*B1;

	 					var x = (Ba*C1 - B1*Ca)/det1;
	 					var y = (A1*Ca - Aa*C1)/det1;
	 				}
	 			};

	 			break; 
 		}

 		
 		

 		//draw point
 		this.context.beginPath();
 		this.context.arc(x,y,4,0,Math.PI * 2);
 		this.context.fillStyle = colors[i % colors.length];
 		this.context.fill();

 		//draw angle
 		this.context.beginPath();
 		this.context.moveTo(this.center_x, this.center_y);
 		this.context.lineTo(x,y);
 		this.context.stroke();

 		//draw height
 		this.context.beginPath();
 		this.context.moveTo(0,y);
 		this.context.lineTo(this.radius * 3,y);
 		this.context.strokeStyle = 'gray';
 		this.context.stroke();

 		//draw line division
 		this.context.beginPath();
 		this.context.moveTo(this.radius * 3, 0);
 		this.context.lineTo(this.radius * 3, this.canvas.height);
 		this.context.stroke();

 		//add point
 		var new_point = new Point(this.radius * 3, y, this.context, i);
 		this.points.push(new_point);

 		//draw points
 		for (var i = this.points.length - 1; i >= 0; i--) {
 			this.points[i].draw();
 			if (this.points[i].x > canvas.width) this.points.splice(i,1);
 		};

 	}
 }


function Point (x, y, context, i) {
	this.x = x;
	this.y = y;

	this.radius = 2;

	this.context = context;
	this.i = i;

	this.draw = function () {
		this.context.beginPath();
		this.context.arc(this.x,this.y,this.radius,0,Math.PI * 2);
		this.context.fillStyle = colors[this.i % colors.length];
		this.context.fill();

		this.x+=2;
	}
}

function add_canvas (num_sides) {
	//use time as id
	var d = new Date();
	var dtime = d.getTime();

	var cnv_li  = document.createElement('li');
	var num_ang = document.createElement('input');
	var canvas  = document.createElement('canvas');
	var cnv_ul  = document.getElementById('canvas-ul');

	num_ang.type = 'number';
	num_ang.min = 1;
	num_ang.defaultValue = num_sides;
	num_ang.onchange = val_updated;
	num_ang.id = dtime;

	cnv_li.appendChild(num_ang);
	cnv_li.appendChild(canvas);
	cnv_ul.appendChild(cnv_li);
	cnv_li.className = 'canvas-li';
	canvas.className = 'angler';
	canvas.height = $(".canvas-li").height();
	canvas.width  = $(".canvas-li").width();

	var newAngler = new Angler(canvas, num_sides);

	anglers.push(newAngler);
	num_ang_to_ang[dtime] = newAngler;
}

function init_timer() {
	timer = setInterval(function () {
		angle += (Math.PI * 2)/60;
		angle %= Math.PI * 2;

		for (var i = 0; i < anglers.length; i++) {
			anglers[i].draw(i);
		};
	}, 30);
}



function val_updated () {
	num_ang_to_ang[this.id].num_sides = parseInt(this.value);
}