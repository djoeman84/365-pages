var cookies = ["/img/aug_8/cc_cookie.png", "/img/aug_8/mm_cookie.png","/img/aug_8/gs_cookie.png"]
var sounds = ["A3-220.0.mp3","C5-523.25.mp3","E4-329.63.mp3","A4-440.0.mp3","Csharp4-277.18.mp3","E5-659.26.mp3","Asharp3-233.08.mp3","Csharp5-554.37.mp3","F4-349.23.mp3","Asharp4-466.16.mp3","D4-293.66.mp3","Fsharp4-369.99.mp3","B3-246.94.mp3","D5-587.33.mp3","G4-392.0.mp3","B4-493.88.mp3","Dsharp4-311.13.mp3","Gsharp4-415.3.mp3","C4-261.63.mp3","Dsharp5-622.25.mp3","peep.mp3"]
var time_out = 0;
var delay = 50;
var fade_in = 1000;
var sound = true;
var current_handle;
var mouse_up = true;
var waiting_for_timeout = false;

function pause_sound () {
	waiting_for_timeout = false;
	if(mouse_up) current_handle.pause();
}


function play_sound_effect (src, handle, timeout, loop) {
	if (sound) {
		current_handle = document.getElementById(handle);
		current_handle.src = src;
		if (loop) {
			current_handle.setAttribute('loop','true');
		}
		current_handle.play();
		if (timeout) {
			waiting_for_timeout = true;
			setTimeout(function() {pause_sound()}, timeout);
		}
	}
}


$(document).ready(function () {
	$(".cookie-img").each(function (i, e) {
		e.src = cookies[Math.floor(Math.random() * cookies.length)];
		e.id  = "/audio/aug_8/"+sounds[Math.floor(Math.random() * sounds.length)];
		$(this).hide();
		$(this).delay(time_out + (i * delay)).fadeIn(fade_in);
	});
	$(".cookie-img").mousedown( function () {
		mouse_up = false;
		play_sound_effect(this.id,'soundHandle', 500, true);
	});
	$(document).mouseup(function () {
		mouse_up = true;
		if(!waiting_for_timeout) current_handle.pause();
	})
});