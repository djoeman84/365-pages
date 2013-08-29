var second = 1000;
var key = {'left':37,'up':38,'right':39,'down':40,'shift':16,'space':32,'tab':9};


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

function displayElem (elem) {
	//remove hide and surrounding space if possible
	elem.className = elem.className.replace(' hide','');
	elem.className = elem.className.replace('hide ','');
	elem.className = elem.className.replace('hide','');
}

function hideElem (elem) {
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

function random_array_elem (array) {
	return array[Math.floor(Math.random()*array.length)];
}

function uniform_w_prob (probability) {
	return (Math.random() < probability);
}

function addEventHandler(obj, evt, handler) {
    if(obj.addEventListener) {
        // W3C method
        obj.addEventListener(evt, handler, false);
    } else if(obj.attachEvent) {
        // IE method.
        obj.attachEvent('on'+evt, handler);
    } else {
        // Old school method.
        obj['on'+evt] = handler;
    }
}

Function.prototype.bindToEventHandler = function bindToEventHandler() {
	var handler = this;
	var boundParameters = Array.prototype.slice.call(arguments);
	//create closure
	return function(e) {
		e = e || window.event; // get window.event if e argument missing (in IE)   
		boundParameters.unshift(e);
		handler.apply(this, boundParameters);
	}
};


function get_json_from_url (url, responseHandler) {
	var xmlhttp;
	
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			responseHandler(JSON.parse(xmlhttp.responseText));
		}
	}
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
};