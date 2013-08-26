/*
	365-pages by Joe Delgado. github.com/djoeman84
*/

var display_words = {};

var pretty_field = document.getElementById('pretty-text-field');
var message_ul   = document.getElementById('message-ul');

var max_freq = 20;


function init_js () {
	pretty_field.focus();
}




function get_old_posts (num_posts) {
	return old_posts.slice(0,num_posts);
}


function submit_form () {
	add_words(pretty_field.value);
	pretty_field.value = '';
	return false;
}



function add_words (text) {
	var words = parse_to_arr(text);
	for (var i = 0; i < words.length; i++) {
		var word = words[i];
		if (word in display_words) {
			console.log(display_words[word].elem.style.opacity);
			display_words[word].elem.style.opacity = 
				parseFloat(display_words[word].elem.style.opacity) + 
				1/(max_freq + 1);
		} else {
			var new_elem = document.createElement('li');
			new_elem.style.opacity = 1/(max_freq + 1);
			new_elem.innerHTML = word;
			var new_obj = {};
			new_obj.elem = new_elem;

			display_words[word] = new_obj;
			message_ul.appendChild(new_elem);
		}
	};	
}

function parse_to_arr (text) {
	text = text.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]\s/g,' '); //remove all end punctuation (end of word)
	text = text.replace(/[.?!,]/g,'');	//remove all punctuation which is not part of a word.
	return text.split(/\s+/); //split by any number of spaces to array
}