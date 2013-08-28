/*
	365-pages by Joe Delgado. github.com/djoeman84
*/

function init_js () {
	add_img_drops();
	mute_return_vals(); //stops return key on content editable elems marked with class 'no-return'
}

function mute_return_vals () {
	$(".no-return").keydown(function (e) {if (e.keyCode === 13) return false;});
}

function add_img_drops () {
	var img_drop_divs = document.getElementsByClassName('drop-img-div');
	for (var i = 0; i < img_drop_divs.length; i++) {
		var div_children = img_drop_divs[i].children;
		var img_src, img_trg;
		for (var x = 0; x < div_children.length; x++) {
			if (div_children[x].className.indexOf('drop-img-anchor') !== -1) {
				img_src = div_children[x];
			} else if (div_children[x].className.indexOf('drop-img-target') !== -1) {
				img_trg = div_children[x];
			}
		};
		if (img_src && img_trg) {
			add_img_drop(img_src, img_trg);
		} else {
			console.log('element load error');
		}	
	};
}

function add_img_drop (drop_elem, img_elem) {

	addEventHandler(drop_elem, 'dragover', cancel);
	addEventHandler(drop_elem, 'dragenter', cancel);
	addEventHandler(drop_elem, 'drop', function (e) {
		e = e || window.event; // get window.event if e argument missing (in IE)
		if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.

		var dt    = e.dataTransfer;
		var files = dt.files;

		for (var i = files.length - 1; i >= 0; i--) {
			var file = files[i];
			var reader = new FileReader();
			reader.readAsDataURL(file);
			addEventHandler(reader, 'loadend', function(e, file) {
				var bin = this.result;
				img_elem.file = file;
				img_elem.src = bin;
				hideElem(drop_elem);
				displayElem(img_elem);

			}.bindToEventHandler(file));
		};
	})
}


function cancel(e) {
	if (e.preventDefault) { e.preventDefault(); }
	return false;
}
