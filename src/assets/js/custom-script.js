jQuery(document).ready(function(){

    //Hamburger Menu
    jQuery('.hamburger-menu').click(function () {
      //jQuery('.nav-top-right').toggleClass('menu-open');
      jQuery('header').toggleClass('menu-expend'); 	
    });

    // Testimonials Slider Script
    jQuery('.testimonials-slider-wrapper').slick({
      dots: false,
      infinite: false,
      arrows:false,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 570,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });

    // News Slider Script
    jQuery('.news-slider-wrapper').slick({
      dots: false,
      infinite: false,
      arrows:false,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 570,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });
          

});


jQuery(window).on('load', function(){
	wow = new WOW(
      {
        boxClass:     'wow',      // default
		animateClass: 'animated', // default
		offset:       0,          // default
		mobile:       false,       // default
		live:         true
      }
    );
    wow.init();
});