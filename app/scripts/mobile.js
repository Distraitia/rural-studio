// Mobile!
// Smart resize avoids polling resize event too much
(function($,sr){

    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
        var obj = this, args = arguments;
        function delayed () {
          if (!execAsap)
            func.apply(obj, args);
          timeout = null; 
        };

        if (timeout)
          clearTimeout(timeout);
        else if (execAsap)
          func.apply(obj, args);

        timeout = setTimeout(delayed, threshold || 100); 
      };
    }
    // smartresize 
    $.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

    // USE IT LIKE THIS
    /* If the window is resized, we better resize the images to fit.
    $(window).smartresize(function(){  
        // code that takes it easy...   
    });
    */

})($,'smartresize');

/* script to add a mobile class if the window is under 768px wide */
var mobileState = true,
	tabletState = true,
	windowWidth = $(window).width(),
	body = $('body');
var menuBtnVisible,
	menuIsOpen;

var checkWin = function(){
	if ($(this).width() != windowWidth) {
		windowWidth = $(this).width();       
	}
	if (windowWidth < 1025) {
		$('body').addClass('tablet-B');   
		tabletState = true;
	} else {
		$('body').removeClass('tablet-B');   
		tabletState = false;
	}
	if (windowWidth < 768) {
		$('body').addClass('mobile');   
		mobileState = true;
	} else {
		$('body').removeClass('mobile');   
		mobileState = false;
	}
	if (windowWidth < 481) {
		menuBtnVisible = true;
		// toggleMobileMenu();
		// $('#header').addClass('is-mobile');
		addMobileMenu();
	} else {
		menuBtnVisible = false;
		$("#header li").show();
		// $('#header').removeClass('is-mobile');
	}
}

/* For mobile, there's a large white space underneath the carousel image; this code shortens the gallery to match the height of the image */
function shortenGallery() {
	var imgHeight = $('.ps-carousel img').height(),
		gallery = $('#PhotoSwipeTarget');
	
	gallery.height(imgHeight);
}
function killGallery() {
	$('#PhotoSwipeTarget').hide().remove();
	$('#slidecaption').hide().remove();
}

function photoCred() {
	var credClone = $('#photo-credit').clone().attr('id','photo-credit-mobile');
	// setTimeout(function() { console.clear(); }, 1050);
	
	// creates photo credit clone if it doesn't exist
	if ($('#photo-credit-mobile').length < 1)
		credClone.appendTo($('#PhotoSwipeTarget'));
}


function addMobileMenu() {
	var menuSVG = $('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-1387 829 24 24" enable-background="new -1387 829 24 24" xml:space="preserve"> <path fill="#444444" d="M-1384,847h18v-2h-18V847z M-1384,842h18v-2h-18V842z M-1384,835v2h18v-2H-1384z"/> </svg>');
	var menuBtnDiv = $('<a href="#" id="menuBtn"></a>');
	var mobileMenu = menuBtnDiv.append(menuSVG);

	console.clear();

	if ( $('#menuBtn').length < 1 ) {
		console.log('mobileMenu();');
		$('#header').append(mobileMenu);
	}

	if (menuBtnVisible == true) {
		$("#header li:not(#navHome)").hide();
	} else {
		$("#header li").show();
	}
}
function toggleMobileMenu(e) {
	e.preventDefault();
	// alert('mobile menu toggled');
	var btn = $('#menuBtn');

	if ( menuIsOpen == true ) {
		menuIsOpen = false;
		btn.removeClass('is-active');
		$("#header li:not(#navHome)").hide();
	} else {
		menuIsOpen = true;
		btn.addClass('is-active');
		$('#header li:not(#navHome)').show();
	}
}

$(document).ready(function() {
	checkWin();

	setTimeout(shortenGallery, 1050);
	// setTimeout(checkWin, 400);

	if ($('#Wide').length > 0) {
		setTimeout(killGallery, 900);
	}

	$(window).smartresize(function() {
		checkWin();

		if ( mobileState == true ) {
			addMobileMenu();
		}
		if ( mobileState == true || tabletState == true ) {
			shortenGallery();
			// photoCred();
			$('#photo-credit').hide();
			// setTimeout(function() {$('#photo-credit-mobile').css('opacity','1').show();},400);
		} else {
			$('#photo-credit').show();
			$('#photo-credit-mobile').hide();
		}

		// if ( mobileState == true ) {
		// 	addMobileMenu();
		// }
	});

	$('#menuBtn').on('click', toggleMobileMenu);
});
$(window).load(function() {
	// console.clear();
	var windowWidth = $(window).width();
	addMobileMenu();

	// var credit = $('#photo-credit'),
	// 	imgCreditExists = false;

	// function imgCredit() {
	// 	var length = credit.html().length;

	// 	if (length < 1 ) {
	// 		console.log('no dice');
	// 		setTimeout(imgCredit, 150);
	// 	} else {
	// 		console.log('Yay! ' + length);
	// 		imgCreditExists = true;
	// 	}

	// 	if (imgCreditExists == true) {
	// 		// console.log(credit.html());
	// 		// var creditClone = credit.clone().attr('id','photo-credit-mobile');
	// 	}
	// }
	// imgCredit();

	if ( mobileState == true ) {
		shortenGallery();
	}
});