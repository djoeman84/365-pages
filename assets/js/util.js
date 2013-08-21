var second = 1000;

function displayId (elem_id) {
	//remove hide and surrounding space if possible
	var elem = document.getElementById(elem_id);
	elem.className = elem.className.replace(' hide','');
	elem.className = elem.className.replace('hide ','');
	elem.className = elem.className.replace('hide','');
}

function hideId (elem_id) {
	var elem = document.getElementById(elem_id);
	if (elem.className.indexOf('hide') === -1) {
		elem.className += ' hide';
	}
}

function setImgSrc (elem_id, img_src) {
	document.getElementById(elem_id).src = img_src;
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