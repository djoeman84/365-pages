$(document).ready(function () {
	//day blocks
	$(".day-block").hover(function () {
		$("#info-title").html(data[this.id].title);
		$("#info-desc").html(data[this.id].desc);
		$("#info-panel").attr('href', data[this.id].href); 
	});
	$(".day-block").on("click",function () {
		window.location.href = data[this.id].href;
	});

});
$(window).scroll(function(event) {
	var margin_left = 5-$(document).scrollLeft();
	$(".left-jumbo").css("margin-left", margin_left);
});
