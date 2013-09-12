/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
function init_js () {
	init_maps();
	init_query_form();
}


function get_route_form_data () {
	var origin_query = document.getElementById('origin-input').value;
	var destination_query = document.getElementById('destination-input').value;

	calcRoute(origin_query, destination_query);
	return false;
}

function init_query_form () {
	document.getElementById('origin-input').focus();

}

function key_down (elem, e) {
	if (elem === document.getElementById('directions-form') && e.keyCode === 13) {
		get_route_form_data();
		return false;
	}
}