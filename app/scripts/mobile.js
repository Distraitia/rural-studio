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
var mobileState,
	windowWidth = $(window).width();
var menuBtnVisible,
	menuIsOpen;

var checkWin = function(){
	if ($(this).width() != windowWidth) {
		windowWidth = $(this).width();       
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
	} else {
		menuBtnVisible = false;
		$("#header li").show();
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
	$('#photo-credit').hide().remove();
}

function photoCred() {
	var credClone = $('#photo-credit').clone().attr('id','photo-credit-mobile');
	// setTimeout(function() { console.clear(); }, 1050);
	
	// creates photo credit clone if it doesn't exist
	if ($('#photo-credit-mobile').length < 1)
		credClone.appendTo($('#PhotoSwipeTarget'));
}

var isGalleryPage;

function determinePageType() {
	if ( $('#PhotoSwipeTarget').length < 1 ) {
		isGalleryPage = false;
		// console.log('This is a listing page.');
	} else if ( $('#PhotoSwipeTarget').length > 0 && $('#Wide').length > 0) {
		isGalleryPage = false;
		// console.log('This is the anniversary page.');
	} else if ( $('#PhotoSwipeTarget').length > 0 && $('#Wide').length < 1 ) {
		isGalleryPage = true;
		// console.log('This is a gallery page.');
	}
}
function addMobileMenuBtn() {
	var menuSVG = $('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-1387 829 24 24" enable-background="new -1387 829 24 24" xml:space="preserve"> <path fill="#444444" d="M-1384,847h18v-2h-18V847z M-1384,842h18v-2h-18V842z M-1384,835v2h18v-2H-1384z"/> </svg>');
	var menuBtnDiv = $('<a href="#" id="menuBtn"></a>');
	var mobileMenu = menuBtnDiv.append(menuSVG);

	menuIsOpen = false;

	console.clear();

	if ( $('#menuBtn').length < 1 ) {
		console.log('addMobileMenuBtn();');
		$('#header').append(mobileMenu);
	}
}
function mobileImgCredit() {
	// var credClone = $('#photo-credit').clone().attr('id','photo-credit-mobile');
	
	// if ($('#photo-credit-mobile').length < 1) {
		var credClone = $('#photo-credit').clone().attr('id','photo-credit-mobile');
		credClone.appendTo($('#PhotoSwipeTarget'));
	// }
}

function addMobileMenu() {
	if (menuBtnVisible == true) {
		$("#header li:not(#navHome)").hide();
	} else {
		$("#header li").show();
	}
}
function toggleMobileMenu(e) {
	e.preventDefault();
	// alert('mobile menu toggled');
	var btn = $('#menuBtn'),
		header = $('#header');

	if ( menuIsOpen == true ) {
		menuIsOpen = false;
		header.removeClass('is-open');
		$("#header li:not(#navHome)").hide();
	} else {
		menuIsOpen = true;
		header.addClass('is-open');
		$('#header li:not(#navHome)').show();
	}
}

$(document).ready(function() {
	addMobileMenuBtn();
	determinePageType();
	checkWin();

	setTimeout(shortenGallery, 1050);

	if ( isGalleryPage == false ) {
		setTimeout(killGallery, 900);
	}

	$(window).smartresize(function() {
		checkWin();
		
		if ( mobileState == true ) {
			shortenGallery();
			$('#photo-credit').hide();
		} else {
			$('#photo-credit').show();
			$('#photo-credit-mobile').hide();
		}
	});

	$('#menuBtn').on('click', toggleMobileMenu);
});
$(window).load(function() {
	var windowWidth = $(window).width();

	if ( isGalleryPage == true ) {
		// mobileImgCredit();
		// setTimeout(mobileImgCredit, 500);
	}

	if ( mobileState == true ) {
		shortenGallery();
	}
});