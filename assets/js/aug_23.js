/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
// $(document).ready(function () {
// 	$("#text-body").on('keydown', function (e) {
// 		console.log(e.eventKey);
// 		return true;
// 	})
// });

var text_body = document.getElementById('text-body');

function key_down (e) {
	if(e.keyCode === 13) {
		console.log('enter');
		var new_line = get_new_line();
		text_body.appendChild(new_line);
		//text_body.setSelectionRange(0,0);
		new_line.focus();
		//setEndOfContenteditable(text_body);
		return false;
	}
	console.log(e.keyCode);
	return true;
}

function get_new_line () {
	var new_line = document.createElement('div');
	new_line.className = 'text-line';
	new_line.id = 'hi';
	return new_line;
}

/*  Move to end of contentEditableElement. from Nico Burns:
 *  http://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
 */
function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}