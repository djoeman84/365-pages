/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
var simple_keys =  {'keys':
				   [{'value':'C','onclick':clr_handler},{'value':'&nbsp','onclick':   null},{'value':'&nbsp','onclick':   null},{'value':'/','onclick':div_handler},
				   	{'value':'7','onclick':num_handler},{'value':'8','onclick':num_handler},{'value':'9','onclick':num_handler},{'value':'X','onclick':mlt_handler},
					{'value':'4','onclick':num_handler},{'value':'5','onclick':num_handler},{'value':'6','onclick':num_handler},{'value':'-','onclick':min_handler},
					{'value':'1','onclick':num_handler},{'value':'2','onclick':num_handler},{'value':'3','onclick':num_handler},{'value':'+','onclick':pls_handler},
					{'value':'&nbsp;','onclick':  null},{'value':'0','onclick':num_handler},{'value':'.','onclick':num_handler},{'value':'=','onclick': eq_handler}],
					'width': '4em'
					};
var key_sets = {'simple':simple_keys};

var eq;


function init_js () {
	display_key_set('simple', document.getElementById('keys-ul'));
}


function display_key_set (key_set_name, ul_elem) {
	var key_set = key_sets[key_set_name].keys;
	for (var i = 0; i < key_set.length; i++) {
		ul_elem.appendChild(build_key(key_set[i]));
	}
	ul_elem.style.width = key_sets[key_set_name].width;
}

function build_key (key) {
	var elem = document.createElement('li');
	elem.id = key.value;
	elem.setAttribute('keyVal', key.value);
	elem.innerHTML = key.value;
	elem.className = 'key-li';
	elem.onclick = key.onclick;
	return elem;
}

function clr_handler (e) {
	eq = null;

}

var left_in_use = true;
var num_val = ''; //string until parsed
function num_handler (e) {
	console.log('num_handler');
	num_val += e.toElement.getAttribute('keyVal');
	console.log('numval: '+num_val);
	//console.log(e.toElement.id);
}

function div_handler (e) {
	console.log('div'+e.toElement.id);
}

function mlt_handler (e) {
	console.log('mlt'+e.toElement.id);
}

function pls_handler (e) {
	console.log('pls'+e.toElement.id);
}

function min_handler (e) {
	console.log('min'+e.toElement.id);
}

function eq_handler (e) {
	console.log(' eq'+e.toElement.id);
}


function set_display (str) {
	console.log('display: '+str);
}

