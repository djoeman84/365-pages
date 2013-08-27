/*
	365-pages by Joe Delgado. github.com/djoeman84
*/

function init_js () {
	var logo_img_drop = document.getElementById('logo-img-drop');
	addEventHandler(logo_img_drop, 'dragover', cancel);
    addEventHandler(logo_img_drop, 'dragenter', cancel);
    addEventHandler(logo_img_drop, 'drop', handle_drop);
}


function cancel(e) {
	if (e.preventDefault) { e.preventDefault(); }
	return false;
}




var data_e;
function handle_drop (e) {
	e = e || window.event; // get window.event if e argument missing (in IE)
	if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.

	var dt    = e.dataTransfer;
	var files = dt.files;

	data_e = files;
	for (var i = files.length - 1; i >= 0; i--) {
		var file = files[i];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		addEventHandler(reader, 'loadend', function(e, file) {
			var bin = this.result;
			var img = document.getElementById('header-logo');
			img.file = file;
			img.src = bin;
			hideId('logo-img-drop');
			displayId('header-logo');

		}.bindToEventHandler(file));
	};
	/*
	console.log('drop');
	e.preventDefault();

	var files = e.dataTransfer.files; // FileList object
	console.log(e);
	data_e = e;

	var output = [];
	for (var i = 0, f; f = files[i]; i++) {
		if (!f.type.match('image.*')) {
        continue;
      }

		var reader = new FileReader();

		reader.onload = (function(theFile) {
        	return function(ev) {
        		// Render thumbnail.
        		console.log(ev.target.result);
	        };
      })(f);
	}*/
}
/*
function drop_img (e) {
	e.preventDefault();
	var data=e.dataTransfer.getData("Text");
	e.target.appendChild(document.getElementById(data));
}

function allowDrop(e) {
	e.preventDefault();
}*/

function url_typed () {
	var typed_url = $('#logo-url').val();
	testImage(typed_url, function (url, resp_txt) {
		if (resp_txt === 'success') {
			hideId('logo-url');
			displayId('header-logo');
			setImgSrc('header-logo', $('#logo-url').val());
		}
	})
}


function testImage(url, callback, timeout) {
    timeout = timeout || 5000;
    var timedOut = false, timer;
    var img = new Image();
    img.onerror = img.onabort = function() {
        if (!timedOut) {
            clearTimeout(timer);
            callback(url, "error");
        }
    };
    img.onload = function() {
        if (!timedOut) {
            clearTimeout(timer);
            callback(url, "success");
        }
    };
    img.src = url;
    timer = setTimeout(function() {
        timedOut = true;
        callback(url, "timeout");
    }, timeout); 
}