/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
var zip_json;
var mapDrawing;
var zipHandler;
var us_frame = {'top':52,
				'bottom':22,
				'left':-132,
				'right':-64}
function init_js () {
	$.getJSON('./json/zipcode_tree.json',function(data){
		zip_json = data.data;
		zipHandler = new ZipHandler(zip_json);
		mapDrawing = new MapDrawing(document.getElementById('canvas-wrapper'));
		document.getElementById('zip-form').style.display = 'block';
		mapDrawing.draw(zipHandler.get_zips_by_str(''));
	});
}

function zip_entered (e) {
	var zip_input = document.getElementById('zip-input');
	var zips = zipHandler.get_zips_by_str(zip_input.value);
	if (zips) {
		mapDrawing.draw(zips);
	}
}

function zip_key_down (e) {
	keyCode = e.keyCode;
	if (e.metaKey || e.ctrlKey) return true;
	var accepted_vals = [8,37,39];
	if ((keyCode >= 48 && keyCode <= 57) || (accepted_vals.indexOf(keyCode) !== -1)) return true;
	else return false; //only number values accepted
}

function ZipHandler (data) {
	this.data = data;


	function get_zips (dict) {
		var arr = [];
		if ('zip' in dict) {
			return [dict];
		}
		for (var sub_dict in dict) {
			arr = arr.concat(get_zips(dict[sub_dict]));
		}
		return arr;
	}

	this.get_zips_by_str = function (zip_str) {
		var zip_str_arr = zip_str.split('');
		var dict = this.data;
		for (var i = 0; i < zip_str_arr.length; i++) {
			if (zip_str_arr[i] in dict){
				dict = dict[zip_str_arr[i]];
			} else {
				return undefined;
			}
		};
		return get_zips(dict);
	}
}



function MapDrawing (container) {
	this.container = container;
	this.canvas = document.createElement('canvas');
	this.container.appendChild(this.canvas);
	this.context = this.canvas.getContext('2d');
	this.zips;

	this.init = function () {
		this.resize();
		var map_obj = this;
		window.onresize = function () {
			map_obj.resize();
		};
	}
	this.resize = function () {
		this.canvas.width = this.container.clientWidth;
		this.canvas.height = this.container.clientHeight;
		this.draw();
	}
	this.draw = function (zips) {
		if (zips) this.zips = zips;
		if (zips === undefined && this.zips === undefined) return;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (var i = 0; i < this.zips.length; i++) {
			var cnt_pt = {'x':scale(
								normalize_float(this.zips[i].longitude, us_frame.left, us_frame.right),
									0, this.getframe().width) + this.getframe().offset_x,
						  'y':scale(
								normalize_float(this.zips[i].latitude, us_frame.top, us_frame.bottom),
									0, this.getframe().height)
						};
			this.context.beginPath();
			this.context.arc(cnt_pt.x, cnt_pt.y, 1, 0, Math.PI * 2);
			this.context.fillStyle = 'lightblue';
			this.context.fill();
		};
	}
	this.getframe = function () {
		var ratio_w_to_h = 0.6;
		if (this.canvas.width * ratio_w_to_h < this.canvas.height) {
			return {'width':this.canvas.width,
					'height':this.canvas.width * ratio_w_to_h,
					'offset_x':0
					};
		} else {
			return {'width':this.canvas.height / ratio_w_to_h,
					'height':this.canvas.height,
					'offset_x':(this.canvas.width - this.canvas.height / ratio_w_to_h)/2
					};
		}
	}

	this.init();
}