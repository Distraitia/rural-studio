/* These are the major sections, as well as introduction and final screens

smoke-alarms
cooking
electrical-cords
materials
heaters
smoking
escape-plan

*/


var $ = require('jquery');
var gsap = require('gsap');
var is = require('is_js');
var ScrollMagic = require('scrollmagic');
var ScrollToPlugin = require('./ScrollToPlugin.min.js');
var animationgsap = require('./animation.gsap.min.js');

var classie = require('./classie.js');
var modalEffects = require('./modalEffects.js');
var cssParser = require('./cssParser.js');


/* submit email form */

var showValMessage = function(emailaddress,emailname){
  var message = "";
  if(is.all.empty(emailaddress,emailname)){
    message = "Please fill out the form";
  } else if(is.empty(emailaddress)){
    message = "Plase fill out the email address"
  } else if(is.not.email(emailaddress)){
    message = "The email seems incorrect"  
  } else if(is.empty(emailname)){
    message = "Plase fill out your name" 
  }  

  $('#message').html(message);
}

$('#emailform').submit(function () {
  var emailaddress = $.trim($('#emailaddress').val());
  var emailname = $.trim($('#emailname').val());
  if(is.any.empty(emailaddress,emailname) || is.not.email(emailaddress)){
    showValMessage(emailaddress,emailname);
    return false;        
  } else {
    return true;
  }
});

/* end submit email */



var mobileState = true;
var currentSlate;
var durationValueCache = 600;


var getDuration = function() {
  return durationValueCache;
}

var updateDuration = function(e) {
  durationValueCache = window.innerHeight; 
}


var setupScenes = function() {
  updateDuration();

  slate0 = new ScrollMagic.Scene({triggerElement: "#introduction"})
    .on("enter", callbackIntro)
    .duration(getDuration)
    .addTo(controller);      

  slate1 = new ScrollMagic.Scene({triggerElement: "#smoke-alarms"})
    .on("enter", callbackSmoke)
    .duration(getDuration)
    .addTo(controller);

  slate4 = new ScrollMagic.Scene({triggerElement: "#cooking"})
    .on("enter", callbackCooking)
    .duration(getDuration)
    .addTo(controller);

  slate2 = new ScrollMagic.Scene({triggerElement: "#electrical-cords"})
    .on("enter", callbackElectrical)
    .duration(getDuration)
    .addTo(controller);

  slate3 = new ScrollMagic.Scene({triggerElement: "#heaters"})
    .on("enter", callbackHeaters)
    .duration(getDuration)
    .addTo(controller);

  slate5 = new ScrollMagic.Scene({triggerElement: "#escape-plan"})
    .on("enter", callbackEscape)
    .duration(getDuration)
    .addTo(controller);

  slate6 = new ScrollMagic.Scene({triggerElement: "#materials"})   
    .on("enter", callbackMaterials) 
    .duration(getDuration)
    .addTo(controller);

  slate7 = new ScrollMagic.Scene({triggerElement: "#smoking"})
    .on("enter", callbackSmoking)
    .duration(getDuration)
    .addTo(controller);

  slate8 = new ScrollMagic.Scene({triggerElement: "#results"})
    .on("enter", callbackResults)
    .duration(getDuration)
    .addTo(controller);

  slate9 = new ScrollMagic.Scene({triggerElement: "#product-info"})
    .on("enter", callbackInfo)
    .duration(1285)
    .addTo(controller);

  // change behaviour of controller to animate scroll instead of jump
  controller.scrollTo(function(newpos) {
    TweenMax.to(window, 0.8, {scrollTo: {y: newpos}, ease:Power4.easeOut});

    if (window.history && window.history.pushState) {
      history.pushState("", document.title, currentSlate);
    }

  });

}

var controller = new ScrollMagic.Controller();
setupScenes();



//  bind scroll to anchor links
$(document).on("click", "a[href^=#]", function (e) {
  var id = $(this).attr("href");
  if ($(id).length > 0 && $(this).not('.nojump')) {
    e.preventDefault();

    // trigger scroll
    controller.scrollTo(id);

  }
});

// email form
var mailwrap = $('.mail-wrap');
var mailform = $('.mail-form');
mailform.hide();
mailwrap.addClass('hidden');
$('.mail').on('click', function(){
  if(mailform.is(":visible")){
    mailform.fadeOut();
    mailwrap.addClass('hidden');
  } else {
    mailform.fadeIn();
    mailwrap.removeClass('hidden');
  }
});


/* check for scroll stop, to re-adjust to nearest section */
var timer;
$(window).on('scroll', function(e) {    
    clearTimeout(timer);
    timer = setTimeout(function () {        
      if(!mobileState){
        // console.log('calling placement');
        placement();    
      }
    }, 250);    
});


var setNavDots = function(type){
  var dots = $('.nav-dots');
  dots.removeClass('white-bg').removeClass('gray-bg').removeClass('hidden-bg');
  dots.addClass(type);
  dots.find('li a').removeClass('is-active');
  dots.find('li a[href='+currentSlate+']').addClass('is-active');
}

var showFireman = function(){
  if(!firemanState == "hidden"){
    $(".divider-bar").fadeIn();  
  }  
}

var hideFireman = function(){
  $(".divider-bar").fadeOut();
}

var firemanState = "shown";

function callbackIntro(event) {
        currentSlate = '#introduction';
        setNavDots('white-bg');        
      }

function callbackSmoke(event) {
        currentSlate = '#smoke-alarms';
        setNavDots('gray-bg');
      }

function callbackElectrical(event) {
        currentSlate = '#electrical-cords';
        setNavDots('gray-bg');
      }  

function callbackCooking(event) {
        currentSlate = '#cooking';
        setNavDots('white-bg');
      }            

function callbackHeaters(event) {
        currentSlate = '#heaters';
        setNavDots('gray-bg');
      }   



function callbackMaterials(event) {
        currentSlate = '#materials';
        setNavDots('white-bg');
      }   

function callbackSmoking(event) {
        currentSlate = '#smoking';
        setNavDots('white-bg');

      }                     

function callbackEscape(event) {
        currentSlate = '#escape-plan';
        setNavDots('gray-bg');
        // $('.divider-bar').fadeOut();
      }   

function callbackResults(event) {
        currentSlate = '#results';
        setNavDots('hidden-bg');
        showFireman();
        // $('.divider-bar').fadeIn();
      }  

function callbackInfo(event) {
        currentSlate = '#product-info';
        setNavDots('hidden-bg');
        hideFireman();
        firemanState = "hidden";
        // $('.divider-bar').fadeOut();
      }   

/* determine and scroll to section */
function placement(){
  if(currentSlate !== "#product-info"){
    controller.scrollTo(currentSlate);  
  }  
}


/* listen to checkboxes and change the results screen */

var tally = 0;

/* 
    three states: 
    u = unanswered
    n = nope
    d = done
*/

var boxStates = {    
  "smoke-alarms"      : "u",      
  "cooking"           : "u",
  "electrical-cords"  : "u",          
  "materials"         : "u",  
  "heaters"           : "u",
  "smoking"           : "u",
  "escape-plan"       : "u"   
}

var positiveMessages = {    
 "smoke-alarms"      : "Good, very good.",      
 "cooking"           : "Well done.",
 "electrical-cords"  : "Awesome.",          
 "materials"         : "Outstanding.",  
 "heaters"           : "Brilliant.",
 "smoking"           : "That’s great.",
 "escape-plan"       : "Wonderful."   
}

var negativeMessages = {    
 "smoke-alarms"      : "You should look into this.",      
 "cooking"           : "Please be more careful.",
 "electrical-cords"  : "You have to be aware.",          
 "materials"         : "You should learn more about this.",  
 "heaters"           : "You can’t be too careful.",
 "smoking"           : "You can do better, right?",
 "escape-plan"       : "This is really important." 
}

var processCboxClick = function(slate, val) {
  var theslate = $('#'+slate);

  if(val == true){
    boxStates[slate] = "d";
    $('#'+slate+'-icon').addClass('is-active');
    theslate.find('.is-message').find('h1').text(positiveMessages[slate]);
    tally++;
  } else {
    boxStates[slate] = "n";
    $('#'+slate+'-icon').removeClass('is-active');
    theslate.find('.is-message').find('h1').text(negativeMessages[slate]);
    //tally--;
  }
  /* set the tally number */
  $('#tally').text(tally+'/7')

  /* reveal the message */  
  theslate.find('.numblock').fadeOut(function(){
    theslate.find('.is-message').fadeIn();
    theslate.find('.is-arrow').fadeIn();  
  });
  

}

$('.checkbox input').on('click', function(){
  var cbox = $(this);
  var cboxSlate = cbox.attr('name');
  var cboxDone = false;
  if(cbox.val() == "done"){
    cboxDone = true
  }
  processCboxClick(cboxSlate, cboxDone);
})


/* script to add a mobile class if the window is under 960px wide */
var windowWidth = $(window).width();

var unHide = function(){
  $('.container').addClass('loaded'); 
}


var checkWin = function(){
  if($(this).width() != windowWidth){
      windowWidth = $(this).width();       
   }
   if(windowWidth < 960){
     $('body').addClass('mobile');   
     mobileState = true;
     controller.destroy();
   } else {
     $('body').removeClass('mobile');   
     mobileState = false;
     controller = new ScrollMagic.Controller();
     setupScenes();    
   }
}

var resizables = function(){  
  checkWin();
  updateDuration();
  controller.scrollTo(currentSlate);
  /* other things for the resize event */
}

$(window).on("resize", resizables); 

/* things to do on initial page load */
$(document).ready(function($){  
  checkWin();
  updateDuration();
  $('.bg-img-overlay').fadeIn('fast');
  $('#introduction .bg-img').addClass('bg-img-with-image');
  $('.bg-img-overlay').addClass('bg-animate');
  window.setTimeout(unHide, 1500);   

  $(window).keydown(function(e) {
    if (e.keyCode == 27) {
      $('.md-show').removeClass('md-show');
    } else {
      // alert(e.keyCode);
    }
  });
});