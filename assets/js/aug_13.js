var angle = 0;

var anglers = [];
var num_ang_to_ang = {};
var colors = ['red','blue','green'];

/*
 *  Init
 *
 */
function init_js () {
	add_canvas();
	init_timer();
}


/*
 *  Classes
 *
 */
 function Angler (canvas) {
 	this.num_sides = 1;
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
 				var y = this.center_y - this.radius + Math.abs(((angle - Math.PI)*(this.radius*2))/(Math.PI));
 				break;
 			case 3:
 				var top  = (1.5)*(Math.PI);
 				var step = (2/3)*(Math.PI);
 				//draw shape
 				this.context.beginPath();
 				this.context.moveTo(this.center_x + this.radius * Math.cos(top), this.center_y + this.radius * Math.sin(top));
 				this.context.lineTo(this.center_x + this.radius * Math.cos(top + step), this.center_y + this.radius * Math.sin(top + step));
 				this.context.lineTo(this.center_x + this.radius * Math.cos(top + 2*step), this.center_y + this.radius * Math.sin(top + 2*step));
 				this.context.lineTo(this.center_x + this.radius * Math.cos(top), this.center_y + this.radius * Math.sin(top));
 				this.context.strokeStyle = 'gray';
 				this.context.stroke();

 				//define lines
 				var x1 = this.center_x + this.radius * Math.cos(top),          y1 = this.center_y + this.radius * Math.sin(top);
 				var x2 = this.center_x + this.radius * Math.cos(top + step),   y2 = this.center_y + this.radius * Math.sin(top + step);
 				var x3 = this.center_x + this.radius * Math.cos(top + 2*step), y3 = this.center_y + this.radius * Math.sin(top + 2*step);
 				var x_angle1 = this.center_x + this.radius * Math.cos(angle),  y_angle1 = this.center_y + this.radius * Math.sin(angle);
 				var x_angle2 = this.center_x,                                  y_angle2 = this.center_y;

 				var A1 = y2 - y1;
 				var B1 = x1 - x2;
 				var C1 = A1*x1 + B1*y1;

 				var A2 = y3 - y2;
 				var B2 = x2 - x3;
 				var C2 = A2*x2 + B2*y2;

 				var A3 = y1 - y3;
 				var B3 = x3 - x1;
 				var C3 = A3*x3 + B3*y3;

 				var Aa = y_angle2 - y_angle1;
 				var Ba = x_angle1 - x_angle2;
 				var Ca = Aa*x_angle1 + Ba*y_angle1;


 				//find point
 				var det1 = A1*Ba - Aa*B1;
 				var x1_sol = (Ba*C1 - B1*Ca)/det1;
 				var y1_sol = (A1*Ca - Aa*C1)/det1;

 				var det2 = A2*Ba - Aa*B2;
 				var x2_sol = (Ba*C2 - B2*Ca)/det2;
 				var y2_sol = (A2*Ca - Aa*C2)/det2;

 				var det3 = A3*Ba - Aa*B3;
 				var x3_sol = (Ba*C3 - B3*Ca)/det3;
 				var y3_sol = (A3*Ca - Aa*C3)/det3;

 				if (angle < top && angle > top - step) {
 					var x = x3_sol, y = y3_sol;
 				}else if (angle < top - step && angle > top - 2* step){
 					var x = x2_sol, y = y2_sol;
 				} else {
 					var x = x1_sol, y = y1_sol;
 				}
 				break;

 			case 4:

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
 		this.context.lineTo(this.canvas.width,y);
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

function add_canvas () {
	var cnv_li  = document.createElement('li');
	var num_ang = document.createElement('input');
	var canvas  = document.createElement('canvas');
	var cnv_ul  = document.getElementById('canvas-ul');

	num_ang.type = 'number';
	num_ang.min = 1;
	num_ang.max = 3;
	num_ang.defaultValue = 1;
	num_ang.onchange = val_updated;

	cnv_li.appendChild(num_ang);
	cnv_li.appendChild(canvas);
	cnv_ul.appendChild(cnv_li);
	cnv_li.className = 'canvas-li';
	canvas.className = 'angler';
	canvas.height = $(".canvas-li").height();
	canvas.width  = $(".canvas-li").width();

	var newAngler = new Angler(canvas);

	anglers.push(newAngler);
	num_ang_to_ang[num_ang] = newAngler;
}

function init_timer() {
	setInterval(function () {
		angle += (Math.PI * 2)/60;
		angle %= Math.PI * 2;

		for (var i = 0; i < anglers.length; i++) {
			anglers[i].draw(i);
		};
	}, 30);
}



function val_updated () {
	num_ang_to_ang[this].num_sides = parseInt(this.value);
}