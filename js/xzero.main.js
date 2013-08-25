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

var Core = {
    
    backgroundImages: x0Map.backgroundImages,
    
    // Spinner management
    spinnerMgr: {
        targetId: 'section#MLSpinner div.spinnerLoad',
        
        set: function() {
            spriteHandler.animationStart(Core.spinnerMgr.targetId, {
                fps: 11,
                frames: 12,
                vertical: 1,
                reverse: false
            });
            return true;
        },
        
        destroy: function() {
            spriteHandler.animationContainer[Core.spinnerMgr.targetId].toggle();
            jQuery(Core.spinnerMgr.targetId).removeClass('animated bounceIn').addClass('animated bounceOut');
            return true;
        }
    },
    
    // Experimental: "ScrollMeToPage"
    pageHandler: {
        isAvailable: true,
        
        load: function(type, callback) {
          if(!Core.pageHandler.isAvailable) {
            return false;
          }
          Core.pageHandler.isAvailable = false;
        
          if(type == 'transition') {
            jQuery('nav.header div a').addClass('cssLoading');
            jQuery('html, body').addClass('cssLoading');
          }
            
          jQuery('html, body').animate({ scrollTop: 0 }, 'slow', function() {
                      
              html2canvas(document.body, {
                background: '#141414',
                allowTaint: true,
                taintTest: false,
                //letterRendering: true,
                onrendered: function(canvas) {

                 // Set screenshot
                 jQuery('section#MLOverlay').show().css({
                     'background-image': 'url('+canvas.toDataURL('image/jpeg', 1)+')'
                 });
                    
                 // Execute callback
                 if(callback !== undefined) {
                    callback();
                 }
                    
                 Core.pageHandler.isAvailable = true;
                }
              });
          });
        },
        
        finish: function(type) {
            
            jQuery('section#MLOverlay' + (type == 'alert' ? ', section#MLAlert' : '')).css({'right': jQuery(window).width()+300});
            setTimeout(function() {
              jQuery('html, body, nav.header div a').removeClass('cssLoading');
              jQuery('section#MLOverlay' + (type == 'alert' ? ', section#MLAlert' : '')).hide().css({'right': 0, 'background-image': 'none'});
              
              // Hide also boxes
              if(type == 'alert') {
                jQuery('section#MLAlert div').hide();
              }
                    
            }, 1200);
        }
    }
};

jQuery(document).ready(function() {
    
    // Activate spinner
    Core.spinnerMgr.set();
    
    // Remove spinner once all images loaded
    jQuery.cacheImage(Core.backgroundImages, {
        // Complete callback is called on load, error and abort
        complete: function(e) {
            
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
            jQuery('section.welcome div aside:first-child').addClass('active animated bounceInLeft');
            setTimeout(function() {
                jQuery('section.welcome div aside:last-child').addClass('active animated fadeInRight');
            }, 800);
            
            // Test loader
            jQuery('nav.header div a:nth-child(2)').on('click', function(e) {
                e.preventDefault();
                Core.pageHandler.load('alert', function() {
                    setTimeout(function() {
                        jQuery('section#MLAlert, section#MLAlert div.uiDocumentation').show();
                        jQuery('section#MLAlert div.uiDocumentation').addClass('animated bounceInDown');
                    }, 10);
                });
            });
            jQuery('nav.header div a:nth-child(3)').on('click', function(e) {
                e.preventDefault();
                Core.pageHandler.load('alert', function() {
                    setTimeout(function() {
                        jQuery('section#MLAlert, section#MLAlert div.uiPlugins').show();
                        jQuery('section#MLAlert div.uiPlugins').addClass('animated bounceInDown');
                    }, 10);
                });
            });
            jQuery('nav.header div a:nth-child(4)').on('click', function(e) {
                e.preventDefault();
                Core.pageHandler.load('alert', function() {
                    setTimeout(function() {
                        jQuery('section#MLAlert, section#MLAlert div.uiBoards').show();
                        jQuery('section#MLAlert div.uiBoards').addClass('animated bounceInDown');
                    }, 10);
                });
            });
            
            // Exit button close
            jQuery('section#MLAlert div button.close').on('click', function(e) {
                e.preventDefault();
                Core.pageHandler.finish('alert');
            });
        
            // Adding scroll detection for features animations
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
                           jqueryEachSelect[index].addClass('animated fadeInUp');
                       }, timeOut);
                       timeOut = timeOut + timeOutConfig;
                   });
                   
                   // Show non prominent features
                   setTimeout(function() {
                       jQuery('section.features div article ul.others').addClass('animated fadeInUp');
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
            
            // Toggle spinner
            Core.spinnerMgr.destroy();
            
            // Fade out background
            jQuery('section#MLSpinner').addClass('animated fadeOut');
            setTimeout(function() {
                jQuery('section#MLSpinner').hide();
            }, 500);
        }
    });
});