var months = ["","January","February","March","April","May","June","July","August","September","October","November","December"];




$(document).ready(function () {
	//day blocks
	$(".day-block").hover(hover_focus);
	$(".day-block").focus(hover_focus);
	$(".day-block").on("click",function () {
		window.location.href = data[this.id].href;
	});
	$("#dropdown-button").on("mouseenter",dropdown_menu);
	$(".dropdown").on("mouseleave", pullup_menu);
	$('.hidden').css('height',function(i,h){
        $(this).css('display','none');
    });
});
$(window).scroll(function(event) {
	var margin_left = 5-$(document).scrollLeft();
	$(".left-jumbo").css("margin-left", margin_left);
});

function hover_focus () {
	$("#info-title").html(data[this.id].title);
	$("#info-desc").html(data[this.id].desc);
	$("#info-panel").attr('href', data[this.id].href); 
}

function pullup_menu () {
	if ($(".dropdown").css('display') !== 'none') {
		$(".dropdown").slideUp(function () {
			$("#dropdown-button > span").addClass('down');
			$("#dropdown-button > span").removeClass('up');
			$("#dropdown-button").attr('href','javascript:dropdown_menu()');
		});
	};
};

function dropdown_menu() {
	if ($(".dropdown").css('display') === 'none') {
		$(".dropdown").slideDown(function () {
			$("#dropdown-button > span").removeClass('down');
			$("#dropdown-button > span").addClass('up');
			$("#dropdown-button").attr('href','javascript:pullup_menu()');
		});	
	};
};

function load_dropdown_elems () {
	var li_html = "";
	for (var i = 0; i < month_anchors.length; i++) {
		if (month_anchors[i] != "") {
			li_html += '<li><a class="dropdown-month-elems" href="#'+month_anchors[i]+'">'+months[i]+'</a></li>';
		}
	};
	$("#dropdown-ul").html(li_html);
}