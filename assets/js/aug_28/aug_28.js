/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
var simple_keys =  {'keys':
				   [{'value':'C','onclick':clr_handler},{'value':'(','onclick':num_handler},{'value':')','onclick':num_handler},{'value':'/','onclick':num_handler},
				   	{'value':'7','onclick':num_handler},{'value':'8','onclick':num_handler},{'value':'9','onclick':num_handler},{'value':'*','onclick':num_handler},
					{'value':'4','onclick':num_handler},{'value':'5','onclick':num_handler},{'value':'6','onclick':num_handler},{'value':'-','onclick':num_handler},
					{'value':'1','onclick':num_handler},{'value':'2','onclick':num_handler},{'value':'3','onclick':num_handler},{'value':'+','onclick':num_handler},
					{'value':'&nbsp;','onclick':  null},{'value':'0','onclick':num_handler},{'value':'.','onclick':num_handler},{'value':'=','onclick': eq_handler}],
					'width': '4em'
					};
var key_sets = {'simple':simple_keys};


function init_js () {
	display_key_set('simple', document.getElementById('keys-ul'));
	resize();
}

function resize () {
	document.getElementById('display').style.width = (window.innerWidth - document.getElementById('outer-calc-body').offsetWidth - 12).toString() + 'px';
	document.getElementById('display').style.height = (window.innerHeight*(2/3)).toString()+'px';
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




var eq_str = ''; //string until parsed
var eq;


function clr_handler (e) {
	eq_str = '';
	eq = undefined;
	update_disp();
}

function num_handler (e) {
	eq_str += e.toElement.getAttribute('keyVal');
	update_disp();
}

function eq_handler (e) {
	eq = parseEq(eq_str)
	update_disp(true);
	clr_handler();
}

var curr_li;
function update_disp (new_line) {
	new_line = (new_line || false);
	if (new_line && curr_li) {
		curr_li.innerHTML = eq.toString() + '=' + eq.evaluate();
		curr_li.className = 'faded';
	}
	if (new_line ^ !curr_li) { //both on or both off
		curr_li = document.createElement('li');
		document.getElementById('display-ul').appendChild(curr_li);
	}
	if(curr_li) {
		curr_li.innerHTML = eq_str;
	}
	document.getElementById('display').scrollTop = document.getElementById('display').scrollHeight
}



function handle_op (OP_Class) {
	if (num_val) {
		console.log(OP_Class);

	}
	clr_handler();
}

