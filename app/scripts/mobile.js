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

// console.log('%c Oh my heavens! ', 'background: #222; color: #bada55');
var logColor = '#eeeeff',
	logBG = '#000',
	logPadding = '10px',
	logFontSize = '22px';

/* script to add a mobile class if the window is under 1025px wide */
var mobileState = true;
var windowWidth = $(window).width();

var imgHeight = $('.ps-carousel img').height(),
		gallery = $('#PhotoSwipeTarget');

var checkWin = function(){
	if($(this).width() != windowWidth){
		windowWidth = $(this).width();       
	}
	if(windowWidth < 1025){
		$('body').addClass('mobile');   
		mobileState = true;
	} else {
		$('body').removeClass('mobile');   
		mobileState = false;
	}
}

/* For mobile, there's a large white space underneath the carousel image; this code shortens the gallery to match the height of the image */
function shortenGallery() {
	var imgHeight = $('.ps-carousel img').height(),
		gallery = $('#PhotoSwipeTarget');
	
	gallery.height(imgHeight);
}

function photoCred() {
	var credClone = $('#photo-credit').clone().attr('id','photo-credit-mobile');
	setTimeout(function() { console.clear(); }, 900);
	
	// creates photo credit clone if it doesn't exist
	if ($('#photo-credit-mobile').length < 1)
		credClone.appendTo($('#PhotoSwipeTarget'));

	if ($('body').hasClass('mobile')) {
		// console.log
	}
}

$(document).ready(function() {
	var body = $('body');

	checkWin();

	setTimeout(shortenGallery, 900);

	$(window).smartresize(function() {
		checkWin();

		// if ( body.hasClass('mobile') ) {
		if ( mobileState == true ) {
			shortenGallery();
			photoCred();
			$('#photo-credit').hide();
			$('#photo-credit-mobile').show();
		} else {
			$('#photo-credit').show();
			$('#photo-credit-mobile').hide();
		}
	});
});
$(window).load(function() {
	// console.clear();
	shortenGallery();
});