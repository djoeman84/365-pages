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

function closest_elem (arr, elem, sorted, cmp_fn) {
	if (sorted) {
		console.log('NOT IMPLEMENTED');
	} else {
		var closest;
		var closest_val;
		if (cmp_fn) {
			for (var i = 0; i < arr.length; i++) {
				if (closest === undefined || Math.abs(cmp_fn(arr[i], elem)) < closest_val) {
					closest_val = Math.abs(cmp_fn(arr[i], elem));
					closest = i;
				}
			};
		} else {
			for (var i = 0; i < arr.length; i++) {
				if (closest === undefined || Math.abs(arr[i] - elem) < closest_val) {
					closest_val = Math.abs(arr[i] - elem);
					closest = i;
				}
			};
		}
		
		return closest;
	}
}

function uniform_w_prob (probability) {
	return (Math.random() < probability);
}

function normalize_float (num, floor, ceil) {
	return (num - floor)/(ceil - floor);
}

function scale (num, floor, ceil) {
	return num * (ceil - floor) + floor;
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

function new_elem (aux) {
	var ret_elem = document.createElement(aux.type);
	if (aux.attributes) {
		var attributes = aux.attributes;
		for (var i = 0; i < attributes.length; i++) {
			ret_elem.setAttribute(attributes[i].name,attributes[i].value);
		};
	}
	if (aux.innerHTML) ret_elem.innerHTML = aux.innerHTML;
	if (aux.children) {
		var children = aux.children;
		for (var i = 0; i < children.length; i++) {
			ret_elem.appendChild(children[i]);
		};
	}
	return ret_elem;
}


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


/* from http://stackoverflow.com/questions/4673527/converting-milliseconds-to-a-date-jquery-js */
Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    var dateObject = this;
    YY = ((YYYY=dateObject.getFullYear())+"").slice(-2);
    MM = (M=dateObject.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=dateObject.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);

    h=(hhh=dateObject.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=dateObject.getMinutes())<10?('0'+m):m;
    ss=(s=dateObject.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
}