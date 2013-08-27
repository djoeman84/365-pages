var acceptable_symbols = [32];

var spinner = document.getElementById('spinner');

function key_down (e) {
	if (e.keyCode === 8) { //delete
		spinner.innerHTML = spinner.innerHTML.substring(0, spinner.innerHTML.length - 1);
		return true;
	} else if ((e.keyCode >= 65 && e.keyCode <=90) || (!e.shiftKey && (e.keyCode >= 48 && e.keyCode <=57)) || $.inArray(e.keyCode, acceptable_symbols) !== -1) {
		if (e.shiftKey) {
			spinner.innerHTML += String.fromCharCode(e.keyCode);
		} else {
			spinner.innerHTML += String.fromCharCode(e.keyCode).toLowerCase();
		}
		return true;
	}
	return false;
}