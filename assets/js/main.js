
$(document).ready(function () {
	//day blocks
	$(".day-block").on("mouseenter", function () {
		$(this).css('box-shadow', "0 0 8px #33D6FF");
		$(this).css('z-index', "10000");
		$(this).css('opacity', "0.8");
		$(this).css('filter','alpha(opacity=80)'); /* For IE8 and earlier */
		$("#info-title").html(data[this.id].title);
		$("#info-desc").html(data[this.id].desc);
	});
	$(".day-block").on("click",function () {
		window.location.href = data[this.id].href;
	});
	$(".day-block").on("mouseleave", function () {
		$(this).removeAttr('style');
	});

	//social media buttons
	$(".link").on("mouseenter", function () {
		$(this).css('opacity','1.0');
		$(this).css('filer','alpha(opacity=100)');
	});
	$(".link").on("mouseleave", function () {
		$(this).removeAttr('style');
	});

});

$(window).scroll(function(event) {
	var margin_left = 5-$(document).scrollLeft();
	$(".left-jumbo").css("margin-left", margin_left);
});