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