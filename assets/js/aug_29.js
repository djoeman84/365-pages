/*
	365-pages by Joe Delgado. github.com/djoeman84
*/

var text_body = document.getElementById('text-body');
var indent = 3;




function init_js () {
	text_body.focus();
}



function key_up (e) {
	if (e.keyCode === 13) {
		format_for_brackets(text_body);
	}
	if (e.shiftKey && (e.keyCode === 219 || e.keyCode === 221)) { //{ or }
		format_for_brackets(text_body);
	}
	return true;
}


function format_for_brackets (body) {
	var bracket_depth = 0;
	var childNodes = document.getElementById('text-body').childNodes;
	for (var i = 0; i < childNodes.length; i++) {
		var node = childNodes[i];
		var text = '';
		if (node.tagName !== 'DIV') {
			text = node.data;
			node = node.parentElement;
		} else {
			text = node.innerHTML;
		}
		console.log('text: '+text+', b_d: '+bracket_depth);
		set_spaces(node, bracket_depth);
		for (var n = 0; n < text.length; n++) {
				if (text[n]==='{') bracket_depth ++;
				else if (text[n]==='}') bracket_depth--;
		};
	};
}




function count_leadin_spaces (elem) {
	var num_spaces = 0;
	var split_by_space = elem.innerHTML.split(/&nbsp;|\s/g);//regex split by space or escaped space
	for (var i = 0; i < split_by_space.length; i++) {
		if (split_by_space[i] === '') num_spaces++; 
		else break;
	};
	return num_spaces;
}

function set_spaces (elem, num_spaces) {
	var diff = (num_spaces - count_leadin_spaces(elem)) * indent;
	if (diff > 0) {
		for (var i = 0; i < diff; i++) {
			elem.innerHTML = '&nbsp;'+elem.innerHTML;
		};
	} else if (diff < 0) {
		var neg_diff = -diff;
		for (var i = 0; i < neg_diff; i++) {
			elem.innerHTML = elem.innerHTML.replace(/&nbsp;|\s/,'');
		};
		if (elem.innerHTML[0]===' ') elem.innerHTML = elem.innerHTML.replace(/\s/,'&nbsp;');
	}
	setTimeout(function  () {
		moveCaret(window, diff);
	}, 1);
}


function moveCaret(win, charCount) {
    var sel, range;
    if (win.getSelection) {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var textNode = sel.focusNode;
            var newOffset = sel.focusOffset + charCount;
            sel.collapse(textNode, Math.min(textNode.length, newOffset));
        }
    } else if ( (sel = win.document.selection) ) {
        if (sel.type != "Control") {
            range = sel.createRange();
            range.move("character", charCount);
            range.select();
        }
    }
}



var type_1 = ['break','case','catch','continue','debugger','default','do','else','finally','for','if','return','switch','throw','try','throw','try','while'];
var type_2 = ['delete','instanceof','new','in','typeof','with'];
var type_3 = ['this'];
var type_4 = ['function','var','void'];



