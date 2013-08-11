var colors = ['#FFFFFF','#83C5D1','#B2D9D6','#798287','#C3DCBF','#C7DAD4'];
var graph_building_functions = [{'fn':smooth_line_graph,'class':'half-wide'}, {'fn':line_graph,'class':'half-wide'}, {'fn':pie_chart,'class':'quarter-wide'}, {'fn':pie_chart,'class':'quarter-wide'}];
var canvases_ul;


function draw () {
	canvases_ul = document.getElementById("canvases-ul");
	for (var i = 0; i < graph_building_functions.length; i++) {
		fn = graph_building_functions[i].fn;
		fn(i, graph_building_functions[i].class);
	};
}

function sum (array, attr) {
	var total = 0;
	if (attr) {
		for (var i = 0; i < array.length; i++) {
			total += array[i][attr];
		};
	} else {
		for (var i = array.length - 1; i >= 0; i--) {
			total += array[i]
		};
	}
	return total;
}

function max (array, attr) {
	if (attr) {
		var max = array[0][attr];
		for (var i = 0; i < array.length; i++) {
			if (array[i][attr] > max) {
				max = array[i][attr];
			}
		};
	} else {
		var max = array[0];
		for (var i = 0; i < array.length; i++) {
			if (array[i] > max) {
				max = array[i];
			}
		};
	}
	return max;
}

function min (array, attr) {
	if (attr) {
		var min = array[0][attr];
		for (var i = 0; i < array.length; i++) {
			if (array[i][attr] < min) {
				min = array[i][attr];
			}
		};
	} else {
		var min = array[0];
		for (var i = 0; i < array.length; i++) {
			if (array[i] < min) {
				min = array[i];
			}
		};
	}
	return min;
}

function shuffle(array) {
	var counter = array.length, temp, index;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

function ceil_arr (array, val, attr) {
	if (attr) {
		for (var i = 0; i < array.length; i++) {
			if (val <= array[i][attr]) return i;
		};
	} else {
		for (var i = 0; i < array.length; i++) {
			if (val <= array[i]) return i;
		};
	}
}

function floor_arr (array, val, attr) {
	if (attr) {
		for (var i = array.length - 1; i >= 0; i--) {
			if (val >= array[i][attr]) return i;
		};
	} else {
		for (var i = array.length - 1; i >= 0; i--) {
			if (val >= array[i]) return i;
		};
	}
}

function get_center_x (elem_class, canvas) {
	if (elem_class == "half-wide") {
		return canvas.width/4;
	} else {
		return canvas.width/2;
	}
}

function get_canvas (i, elem_class) {
	var canvas_li = document.createElement('li');
	var canvas = document.createElement('canvas');

	canvas_li.className = 'canvas-li ' + elem_class;
	canvas_li.id = 'canvas-li-'+i;

	canvas_li.appendChild(canvas);
	canvases_ul.appendChild(canvas_li);
	
	canvas.width = $("#"+canvas_li.id).width();
	canvas.height = $("#"+canvas_li.id).height();

	return canvas;
}

function pie_chart (i, elem_class) {
	canvas = get_canvas(i, elem_class);

	var ctx=canvas.getContext("2d");


	center_y = canvas.height/2;
	center_x = get_center_x(elem_class, canvas);
	circ_r = canvas.height/3;

	var data = [{'name':'a','val':20},{'name':'a','val':30},{'name':'a','val':10},{'name':'a','val':14}];
	data.sort(function (a, b) {
		return b.val - a.val;
	});

	var sum_data = sum(data, 'val');
	var start_pos_in_circle = -Math.PI/2;

	shuffle(colors);

	for (var i = 0; i < data.length; i++) {
		var end_point = start_pos_in_circle + (data[i].val/sum_data)*Math.PI*2;
		ctx.fillStyle = colors[i % colors.length];

		ctx.beginPath();
		ctx.arc(center_x,center_y,circ_r,start_pos_in_circle,end_point);
		ctx.lineTo(center_x, center_y);
		ctx.fill();
		start_pos_in_circle = end_point;
	};

}



function line_graph (i, elem_class) {
	canvas = get_canvas(i, elem_class);
	var ctx=canvas.getContext("2d");

	//data
	var data = [{'date':0,'val':5}, {'date':1,'val':3}, {'date':2,'val':6},{'date':3,'val':19},{'date':4,'val':19},{'date':5,'val':12}];
	var min_date = min(data, 'date');
	var max_date = max(data, 'date');
	var date_diff = max_date - min_date;
	var min_val = min(data, 'val');
	var max_val = max(data, 'val');
	var val_diff = max_val - min_val;


	//measurements
	var graph_coord = {'left':canvas.width/8,
						'right':(canvas.width - canvas.width/8),
						'top':canvas.height/5,
						'bottom':(canvas.height - canvas.height/5)};

	var g_width = graph_coord.right - graph_coord.left;
	var g_height = graph_coord.bottom - graph_coord.top;

	//draw axes
	ctx.beginPath();
	ctx.fillStyle = colors[0];
	
	for (var i = 0; i < data.length; i++) {
		var x = ((data[i].date - min_date)/date_diff)*g_width + graph_coord.left;
		var y = graph_coord.bottom - ((data[i].val - min_val)/val_diff)*g_height;
		if (i===0) ctx.moveTo(x,y);
		else ctx.lineTo(x,y);
	};
	
	ctx.stroke();


}


function smooth_line_graph (i, elem_class) {
	canvas = get_canvas(i, elem_class);
	var ctx=canvas.getContext("2d");

	//data
	var data = [{'date':0,'val':5}, {'date':1,'val':3}, {'date':2,'val':6},{'date':3,'val':19},{'date':4,'val':19},{'date':5,'val':12}];
	var min_date = min(data, 'date');
	var max_date = max(data, 'date');
	var date_diff = max_date - min_date;
	var min_val = min(data, 'val');
	var max_val = max(data, 'val');
	var val_diff = max_val - min_val;


	//measurements
	var graph_coord = {'left':canvas.width/8,
						'right':(canvas.width - canvas.width/8),
						'top':canvas.height/5,
						'bottom':(canvas.height - canvas.height/5)};

	var g_width = graph_coord.right - graph_coord.left;
	var g_height = graph_coord.bottom - graph_coord.top;

	//draw axes
	ctx.beginPath();
	ctx.fillStyle = colors[0];
	
 	if (data.length) {
 		ctx.moveTo((min_date/date_diff)*g_width);
 		for (var x = graph_coord.left; x < graph_coord.right; x++) {
 			//get height based off of left and right data points
 			var aprox_date = (x - graph_coord.left)*date_diff/g_width + min_date;


 			var i_floor = floor_arr(data, aprox_date, 'date');
 			var i_ceil  = ceil_arr(data,  aprox_date, 'date');


 			var x_floor = ((data[i_floor].date - min_date)/date_diff)*g_width + graph_coord.left;
 			var x_ceil  = ((data[i_ceil].date  - min_date)/date_diff)*g_width + graph_coord.left;

 			var y_floor = graph_coord.bottom - ((data[i_floor].val - min_val)/val_diff)*g_height;
 			var y_ceil  = graph_coord.bottom - ((data[i_ceil].val  - min_val)/val_diff)*g_height;


 			var x_to_x_floor = x - x_floor;
 			var x_to_x_ceil = x_ceil - x;
 			if (x_to_x_floor === 0) continue;
 			var x_floor_ratio = x_to_x_floor/x_to_x_ceil;
 			var x_ceil_ratio = x_to_x_ceil/x_to_x_floor;
 			var net_diff = x_ceil_ratio + x_floor_ratio;

 			var y = y_ceil * (x_floor_ratio/net_diff) + y_floor * (x_ceil_ratio/net_diff);


 			ctx.lineTo(x,y);
 		};
 	}
	
	
	ctx.stroke();


}


$(document).ready(function () {
	draw();
});