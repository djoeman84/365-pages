/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
var body_wrap = $("#body-wrap");
var prompt = $("#problem-disp >span");
var ans_left = $("#left-ans");
var ans_right = $("#right-ans");

var max_term = 20;
var signs_dict =    {'plus':'+',
					'minus':'-',
					'multiply':'*'};
var signs_arr  =   [signs_dict.plus,
					signs_dict.minus,
					signs_dict.multiply];

var interval;
var user_pressed_left = false;
var user_pressed_right = false;

var slide_time = 1.5*second; //seconds
var pause_time = slide_time/3;



function begin_game () {
	interval = setInterval(function () {
		var eq = get_eq();
		prompt.html(eq.disp);
		ans_left.html(eq.left);
		ans_right.html(eq.right);
		setTimeout(function () {
			if (eq.left_is_correct && user_pressed_left) display_result(true);
			if ((!eq.left_is_correct) && user_pressed_right) display_result(true);
			display_result(false);
			user_pressed_left  = false;
			user_pressed_right = false;
		}, slide_time);	
	}, slide_time + pause_time);
};


function display_result (result) {
	if(result) {
		body_wrap.addClass('green');
	} else {
		body_wrap.addClass('red');
	}
	setTimeout(function () {
		body_wrap.removeClass('red green');
	}, pause_time);
}


function get_eq () {
	var first_term  = Math.floor(Math.random()*(max_term + 1));
	var second_term = Math.floor(Math.random()*(max_term + 1));
	var sign = random_array_elem(signs_arr);
	var setLeftCorrect = uniform_w_prob(0.5);

	switch (sign) {
		case signs_dict.plus:
			var correct = (first_term + second_term).toString();
			break;
		case signs_dict.minus:
			var correct = (first_term - second_term).toString();
			break;
		case signs_dict.multiply:
			var correct = (first_term * second_term).toString();
			break;
		case signs_dict.divide:
			var correct = (first_term / second_term).toString();
			break;
	}
	var incorrect = correct.split('').reverse().join('');
	var disp = first_term.toString() + sign + second_term.toString();
	if (correct === incorrect) return get_eq();
	if (setLeftCorrect) {
		return {'disp':disp,'left':correct,'right':incorrect,'left_is_correct':true};
	} else {
		return {'disp':disp,'left':incorrect,'right':correct,'left_is_correct':false};
	}
}



/*
 * Key press handling
 *
 */
var dir = {'left':37,'right':39};

function flash_opacity(direction) {
	$('#key-'+direction).stop(true);
	var opacity = $('#key-'+direction).css('opacity');
	$('#key-'+direction).animate({opacity:'1.0'}, 100);
	$('#key-'+direction).animate({opacity:'0.30'}, 300);
}


function key_pressed (code) {
	switch (code) {
		case dir.left:
			flash_opacity('left');
			user_pressed_left  = true;
			user_pressed_right = false;
			break;
		case dir.right:
			flash_opacity('right');
			user_pressed_left  = false;
			user_pressed_right = true;
			break;
	}
}

$(document).keydown(function (e) {
	key_pressed(e.keyCode);
})

begin_game();