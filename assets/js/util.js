function display (elem) {
	//remove hide and surrounding space if possible
	elem.className = elem.className.replace(' hide','');
	elem.className = elem.className.replace('hide ','');
	elem.className = elem.className.replace('hide','');
}

function hide (elem) {
	if (elem.className.indexOf('hide') === -1) {
		elem.className += ' hide';
	}
}