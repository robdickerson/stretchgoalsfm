$(document).ready(function(){
	$('#more-info').click(function(e){
		e.preventDefault();
		$('html, body').animate({ scrollTop: $("#scrollTo").offset().top }, 1000);
	});

	$('.request-demo-btn').click(function(e){
		e.preventDefault();
		$('html, body').animate({ scrollTop: $("#schedule-demo-wrapper").offset().top }, 1000);
	});
});

(function() {
	"use strict";

	var resizeTimer;
	var windowWidth;

	$(window).on('resize', function() {
		clearTimeout(resizeTimer);

		resizeTimer = setTimeout(function() {
			windowWidth = $(window).width();

			if (windowWidth > 990) {
				$("#main-nav").fadeIn(300);
			}
		}, 250);
	});

	var toggles = document.querySelectorAll(".hamburger");

	

	function toggleHandler(toggle) {
		toggle.addEventListener( "click", function(e) {
			e.preventDefault();

			if (this.classList.contains("is-active") === true) {
				this.classList.remove("is-active");
				$("#main-nav").fadeOut(300);
				$(".wrapper").removeClass("noscroll");
			} else {
				this.classList.add("is-active");
				$("#main-nav").fadeIn(300);
				$(".wrapper").addClass("noscroll");
			}
		});
	}
	
	for (var i = toggles.length - 1; i >= 0; i--) {
		var toggle = toggles[i];
		toggleHandler(toggle);
	}
})();