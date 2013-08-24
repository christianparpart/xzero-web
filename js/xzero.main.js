var spriteHandler = {
        
    animationContainer: [],
    animationStart: function(selectorUI, options) {                    
        spriteHandler.animationContainer[selectorUI] = new Motio(jQuery(selectorUI)[0], options);
        
        if(options.reverse) {
            spriteHandler.animationContainer[selectorUI].play(true);
            return true;
        }
        
        spriteHandler.animationContainer[selectorUI].play();
        return true;
    },
};

jQuery(document).ready(function() {
            
    // Download package menus listener
    jQuery('nav.download div button.right').on('click', function() {
        jQuery(this).addClass('active');
        jQuery('nav.download div h4').addClass('active');
        
        jQuery(this).on('mouseleave', function() {
            jQuery(this).removeClass('active');
            jQuery('nav.download div h4').removeClass('active');
        });
    });
    
    // Slider
    jQuery('header').flexslider({
        animation: 'slide',
        directionNav: false,
        itemWidth: 1920,
        slideshowSpeed: 10000,
        slideshow: false
    });
        
    // Add effect for welcome section
    jQuery('section.welcome div aside').addClass('active animated');
    jQuery('section.welcome div aside:first-child').addClass('fadeInLeftBig');
    jQuery('section.welcome div aside:last-child').addClass('fadeInRightBig');
    
    // Adding scroll detection
    var lastScrollTop = 0;
    jQuery(document).on('scroll', function() {
       var st = $(this).scrollTop();
       // Downscroll detection
       if (st > lastScrollTop && lastScrollTop > 0){
           var timeOutConfig = 500;
           var timeOut = 200;
           jqueryEachSelect = [];
           
           // Show prominent features
           jQuery.each(jQuery('section.features div article ul.principal li'), function(index) {
               jqueryEachSelect[index] = jQuery(this);
               setTimeout(function() {
                   jqueryEachSelect[index].addClass('animated fadeIn');
               }, timeOut);
               timeOut = timeOut + timeOutConfig;
           });
           
           // Show non prominent features
           setTimeout(function() {
               jQuery('section.features div article ul.others').addClass('animated fadeIn');
           }, timeOut);
           
           // Job finished (destroy listener for better performance)
           jQuery(document).off('scroll');
       }
       lastScrollTop = st;
    });
    
    // Sprites
    setTimeout(function() {
        
        // Sprite Transitions
        spriteHandler.animationStart('header ul.slides li div#homepageLogo span', {
            fps: 7,
            frames: 7,
            vertical: 1,
            reverse: false
        });
        
        spriteHandler.animationStart('section.welcome div aside.terminal', {
            fps: 2.5,
            frames: 4,
            vertical: 1,
            reverse: true
        });
        
    }, 500);
    
    // x0 Logo: Motio toggle listener
    jQuery('header ul.slides li div#homepageLogo span').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        spriteHandler.animationContainer['header ul.slides li div#homepageLogo span'].toggle();
    });
});