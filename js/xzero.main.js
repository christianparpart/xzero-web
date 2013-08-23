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
    
    // Sprite Transitions
    setTimeout(function() {
        
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
    }, 1000);
    
    // x0 Logo: Motio toggle listener
    jQuery('header ul.slides li div#homepageLogo span').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        spriteHandler.animationContainer['header ul.slides li div#homepageLogo span'].toggle();
    });
});