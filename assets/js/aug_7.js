
/*
 *  Classes
 *
 */
 function Obstacle (type) {
 	this.type = type;
 	this.height = 60;
 	this.width  = 50;
 	this.x = Math.random() * window.innerWidth;
 	this.y = window.innerHeight + this.height;
 	//methods
 	this.update = function () {
 		this.y -= speed;
 	}
 	this.draw = function () {
 		this.update();
 		var img = document.getElementById(obs_dict[type]['elem-id']);
 		context.drawImage(img,this.x,this.y,this.width,this.height);
 	}
 	this.is_active = function() {
 		return (this.y + this.height > 0); //true if is below top of screen
 	}
 	this.collide = function () {
 		switch (this.type){
 			case 'tree':
 				prepare_top_scores();
 				$('.center-popup').css('display', 'block');
 				clearInterval(game_interval);
 				break;
 			case 'donut':
 				score += speed*5;
 				donuts++;
 				console.log(score);
 				break;
 			case 'wizard':
 				speed*=3;
 				move_per_click_y*=4;
 				likelihood_new_tree *= 1.5;
 				likelihood_new_donut *= 3;
 				move_per_frame_x *= 2;
 				setTimeout(function () {
 					speed/=3;
 					move_per_click_y/=4;
 					likelihood_new_tree /= 1.5;
 					likelihood_new_donut /= 3;
 					move_per_frame_x /=2;
 				}, wizard_spell_len);
 				break;
 		}
 	}
 }

 function Skier () {
 	this.width = 50*1.5;
 	this.height = 60*1.5;
 	this.x = window.innerWidth/2;
 	this.y = window.innerHeight/6;
 	this.direction = 1;
 	this.elem_id = "skier-right";
 	//methods
 	this.collided = function(obstacle) {
 		var skier_corners = [[this.x, this.y], [this.x + this.width, this.y], [this.x, this.y + this.height], [this.x + this.width, this.y + this.height]];
 		var obs_left   = obstacle.x + collision_fudge;
 		var obs_right  = obstacle.x + obstacle.width - collision_fudge;
 		var obs_top    = obstacle.y + collision_fudge;
 		var obs_bottom = obstacle.y + obstacle.height - collision_fudge;

 		for (var i = 0; i < skier_corners.length; i++) {
 			if ((skier_corners[i][0] >= obs_left && skier_corners[i][0] <= obs_right) //x within bounds
 				&&(skier_corners[i][1] >= obs_top && skier_corners[i][1] <= obs_bottom)) {
 				return true;
 			}
 		};
 		
 		return false;
 	}
 	this.in_bounds = function() {
 		return (this.x > 0 && this.y > 0 && this.x + this.width < window.innerWidth && this.y + this.height < window.innerHeight);
 	}
 	this.update = function() {
 		this.x += move_per_frame_x * this.direction;
 		if (!this.in_bounds()) this.x -= move_per_frame_x * this.direction;
 	}
 	this.draw = function() {
 		this.update();
 		var img = document.getElementById(this.elem_id);
 		context.drawImage(img,this.x,this.y,this.width,this.height);
 	}
 }

 /*
  *  Globals
  *
  */
var obstacles = [];
var player_skier;
var canvas;
var context;
var game_interval = 0;
var speed = 3;
var speed_up = 0.0003;
var move_per_click_y = 10;
var move_per_frame_x = 5;
var wizard_spell_len = 10000;
var likelihood_new_tree = 0.03;
var likelihood_new_donut = 0.01;
var likelihood_new_wizard= 0.0007;
var dir = {'left':37,'right':39,'up':38,'down':40};
var obs_dict = {'tree':{'elem-id':'tree', 'height':60,'width':50},'donut':{'elem-id':'donut', 'height':60,'width':60},'wizard':{'elem-id':'wizard', 'height':60,'width':60}};
var score = 0;
var donuts = 0;
var gps_position;
var collision_fudge = 5;//number of pixels to fudge collision by

function prepare_top_scores () {
	var input_name_html = '<input type="text" id="get-name-input">';
	top_scores = [{'name':'enter your name!','display':input_name_html,'score':score}];
	for (var i = 0; i < top_scores_from_db.length; i++) {
		top_scores.push({'name':top_scores_from_db[i].name,'display':top_scores_from_db[i].score,'score':top_scores_from_db[i].score})
	};
	top_scores.sort(function (a,b) {
		return b.score - a.score;
	});
	for (var i = 0; i < top_scores.length && i < 5; i++) {
		$("#get-name-list > #"+i).html(top_scores[i].name + " : "+top_scores[i].display);
	};
}

function execute_with_likelihood (likelihood, fn, arg) {
	if (Math.random() < likelihood) fn(arg);
}

function resize_canvas () {
	context.canvas.width = window.innerWidth;
	context.canvas.height = window.innerHeight;
}

function bounce (object, wall) {
	if (object > wall) return true; //true if object is beyond wall
}

function update_vals () {
	speed += speed_up;
	$('#score').html(Math.floor(score) + ' magical donut score  '+ donuts + ' donuts');
}

function update_canvas () {
	context.clearRect(0, 0, canvas.width, canvas.height);
	update_vals();

	//draw player_skier
	player_skier.draw();

	//draw obstacles
	execute_with_likelihood(likelihood_new_tree, function(arg) {
		obstacles.push(new Obstacle(arg));
	}, 'tree');
	execute_with_likelihood(likelihood_new_donut, function(arg) {
		obstacles.push(new Obstacle(arg));
	}, 'donut');
	execute_with_likelihood(likelihood_new_wizard, function(arg) {
		obstacles.push(new Obstacle(arg));
	}, 'wizard');
	var dead = [];
	for (var i = 0; i < obstacles.length; i++) {
		obs = obstacles[i];
		if(obs.is_active()) {
			obs.draw();
		} else {
			dead.push(i);
		}
		if(player_skier.collided(obs)) {
			obs.collide();
			dead.push(i);
		};
	};
	for (var i = dead.length -1; i >= 0 ; i--) { //reverse so that array does not collapse on remaining elements
		obstacles.splice(dead[i],1);
	};
}

function reset_canvas () {
	clearInterval(game_interval);
	$('.center-popup').removeAttr('style');
	score = 0;
	obstacles = [];
	init_canvas();
}

function init_canvas () {
	getLocation();
	canvas = document.getElementById('main-canvas');
	context = canvas.getContext('2d');
	resize_canvas();
	player_skier = new Skier();
	game_interval = setInterval(update_canvas, 20);
}


function flash_opacity(direction) {
	$('.arrow-keys-li.'+direction).stop(true);
	var opacity = $('.arrow-keys-li.'+direction).css('opacity');
	$('.arrow-keys-li.'+direction).animate({opacity:'1.0'}, 100);
	$('.arrow-keys-li.'+direction).animate({opacity:'0.30'}, 300);
}

function key_pressed(key) {
	if (key == dir['left'] && player_skier.direction == 1) { //left
		console.log('left');
	   flash_opacity('left');
	   player_skier.elem_id = "skier-left";
	   player_skier.direction = -1;
	} 
	if (key == dir['up']) { //up
	   flash_opacity('up');
	   player_skier.y-=move_per_click_y;
	}
	if (key == dir['right'] && player_skier.direction == -1) { //right
	   flash_opacity('right');
	   player_skier.elem_id = "skier-right";
	   player_skier.direction = 1;
	}
	if (key == dir['down']) { //down
	   flash_opacity('down');
	   player_skier.y+=move_per_click_y;
	}
}

function getLocation() {
	if (navigator.geolocation){
		pos = navigator.geolocation.getCurrentPosition(function(pos) {
			gps_position = pos.coords.latitude + ","+pos.coords.longitude;
		});
	}
	return null;
}

//POST
$(document).ready(function () {
	$("#get-name-list").on('keyup','li > #get-name-input' ,function (e) {
	    if (e.keyCode === 13) {
	    	var name = $("#get-name-input").val();
	        $.ajax({
	        	url:'7-AUG',
	        	type:'POST',
	        	data: {
	        		name:name,
	        		loc:gps_position,
	        		score:score,
	        		donuts:donuts
	        	}
	        });
	        $("#get-name-input").parent().html(name+": "+Math.floor(score));
	    }
	});
});


$(window).resize(function (argument) {
	resize_canvas();
})

$(document).keydown(function(e){
	key_pressed(e.keyCode);
});