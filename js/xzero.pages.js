var Pages = new Object;

Pages['/help/privacy'] = {
    title: 'Privacy Policy',
    
    after: function() {
        alert('page destroyed');
    },
    
    before: function() {
        alert('page called');
    }
};

Pages['/docs'] = {
    title: 'Documentation',
    
    after: function() {
        alert('page destroyed');
    },
    
    before: function() {
        alert('page called');
    }
};

Pages['/help/donate'] = {
    title: 'Donations',
    
    after: function() {
        alert('page destroyed');
    },
    
    before: function() {
        alert('page called');
    }
};

Pages[Core.pageHandler.mainPage] = {
    
    title: 'Home',
    
    // Destroy everything
    after: function() {
        
        // Destroy: Scroll events listener
        jQuery(document).off('scroll');
        
        // Destroy: Download package menus listener
        jQuery('nav.download div aside').off('click mouseleave');
        
        // Destroy: Slider interval
        jQuery('header.slds').flexslider('pause');
        
        // Destroy: Test loader listener
        jQuery('nav.header div a').off('click');
        
        // x0 Logo: Motio toggle listener listener
        jQuery('header.slds ul.slides li div#homepageLogo span').off('click');
        
        // Destroy: Sprites
        spriteHandler.animationContainer['header.slds ul.slides li div#homepageLogo span'].destroy();
        spriteHandler.animationContainer['section.welcome div aside.terminal'].destroy();
        
        // Destroy: Thanks and sharing box listener
        jQuery('nav.download div aside span.d a').off('click');
        
        // Destroy: Share xZero buttons listener
        jQuery('section#MLAlert section ul.sharingHandler li a').off('click');
    },
    
    // Init everything
    before: function() {
        
        // Download package menus listener
        jQuery('nav.download div aside').on('click', function() {
            jQuery(this).addClass('active').on('mouseleave', function() {
                jQuery(this).removeClass('active');
            });
        });
        
        // Slider
        jQuery('header.slds').flexslider({
            
            animation: 'slide',
            direction: 'vertical',
            directionNav: false,
            pauseOnHover: false,
            slideshowSpeed: 6500,
            
            //Callback: function(slider) - Fires after each slider animation completes
            before: function(slider) {
                
                if(Core.deepMemory['header.slds']['animatingTo'] == slider.animatingTo) {
                    return false;
                }
                
                // Slider custom events
                switch(slider.animatingTo) {
                        
                    // Toggle Motio on logo
                    case 0:
                    spriteHandler.animationContainer['header.slds ul.slides li div#homepageLogo span'].toggle();
                    break;
                }
                
                return true;
            },
            after: function(slider) {
                
                if(Core.deepMemory['header.slds']['animatingTo'] == slider.animatingTo) {
                    return false;
                }
                
                // Slider custom events
                switch(slider.animatingTo) {
                    // Avatars animations
                    case 1:
                        jQuery('header.slds ul.slides li div#homepageFork span.bigText').addClass('active');
                        
                        setTimeout(function() {
                            jQuery('header.slds ul.slides li div#homepageFork span.bigText.active, header.slds ul.slides li div#homepageFork section.repo, header.slds ul.slides li div#homepageFork').addClass('next');
                        }, 1000);
                    break;
                        
                    // First slide
                    case 0:
                    
                    // Reset 2nd slide
                    jQuery('header.slds ul.slides li div#homepageFork span.bigText, header.slds ul.slides li div#homepageFork section.repo, header.slds ul.slides li div#homepageFork').removeClass('active next');
                    
                    // Stop motio sprite
                    spriteHandler.animationContainer['header.slds ul.slides li div#homepageLogo span'].toggle();
                    break;
                }
                
                Core.deepMemory['header.slds']['animatingTo'] = slider.animatingTo;
                return true;
            }
            //slideshow: false
        });
        
        // Test loader
        jQuery('nav.header div a:nth-child(3)').on('click', function(e) {
            e.preventDefault();
            Core.pageHandler.load('alert', function() {
                setTimeout(function() {
                    jQuery('section#MLAlert, section#MLAlert section.uiPlugins').show();
                    setTimeout(function() {
                        jQuery('section#MLAlert section.uiPlugins').addClass('showScale');
                    }, 20);
                }, 10);
            });
        });
        
        // Adding scroll detection for features animations
        var lastScrollTop = 0;
        jQuery(document).on('scroll', function() {
           var st = jQuery(this).scrollTop();
           // Downscroll detection
           if (st > lastScrollTop && lastScrollTop > 0) {
               
               // Destroy listener for better performance
               jQuery(document).off('scroll');
               
               var timeOutConfig = 500;
               var timeOut = 200;
               jqueryEachSelect = [];
               
               // Show prominent features
               jQuery.each(jQuery('section.features div article ul.principal li'), function(index) {
                   jqueryEachSelect[index] = jQuery(this);
                   setTimeout(function() {
                       jqueryEachSelect[index].addClass('active');
                   }, timeOut);
                   timeOut = timeOut + timeOutConfig;
               });
               
               // Show non prominent features
               setTimeout(function() {
                   jQuery('section.features div article ul.others').addClass('animated fadeIn');
               }, timeOut);
               
               // Show team
               Core.showTeam();
           }
           lastScrollTop = st;
        });
        
        // x0 Logo: Motio toggle listener
        Core.deepMemory['header.slds ul.slides li div#homepageLogo span']['isAvailable'] = true;
        jQuery('header.slds ul.slides li div#homepageLogo span').on('click', function(e) {
            if(Core.deepMemory['header.slds ul.slides li div#homepageLogo span']['isAvailable']) {
                Core.deepMemory['header.slds ul.slides li div#homepageLogo span']['isAvailable'] = false;
                spriteHandler.animationContainer['header.slds ul.slides li div#homepageLogo span'].toggle();
                Core.deepMemory['header.slds ul.slides li div#homepageLogo span']['isAvailable'] = true;
            }
        });
        
        // Thanks and sharing box
        jQuery('nav.download div aside span.d a').on('click', function(e) {
            e.preventDefault();
                            
            // Start alert box in 700ms
            Core.pageHandler.load('alert', function() {
                setTimeout(function() {
                    jQuery('section#MLAlert, section#MLAlert section.uiDownload').show();
                        
                    setTimeout(function() {
                        jQuery('section#MLAlert section.uiDownload').addClass('showScale');
                    }, 20);
                }, 10);
            });
            
            Core.deepMemory['nav.download div aside span.d a']['jqueryObject'] = jQuery(this);
            setTimeout(function() {
                document.location.href = Core.deepMemory['nav.download div aside span.d a']['jqueryObject'].attr('href');
                Core.deepMemory['nav.download div aside span.d a']['jqueryObject'] = false;
            }, 200);
            
            return true;
        });
        
        // Share xZero buttons
        jQuery('section#MLAlert section ul.sharingHandler li a').on('click', function(e) {
            // tests: e.preventDefault();
            
            // Adding another overlay
            jQuery('body').prepend('<section id="MLOverlayD"></section>');
            
            // http://stackoverflow.com/questions/3291712/is-it-possible-to-open-a-popup-with-javascript-and-then-detect-when-the-user-clo
            switch(jQuery(this).attr('class')) {
                    
                case 'entypo-facebook-squared': // Facebook
                var win = window.open('https://www.facebook.com/sharer/sharer.php?s=100&p[url]='+encodeURIComponent(location.href)+
                            '&p[images][0]='+encodeURIComponent(Core.getThumbnail)+
                            '&p[title]='+encodeURIComponent(document.title)+
                            '&p[summary]='+encodeURIComponent(jQuery('meta[name=description]').attr('content')),
                        'facebook-share-dialog',
                        'width=626,height=436');
                var pollTimer = window.setInterval(function() {
                    if (win.closed !== false) { // !== is required for compatibility with Opera
                        window.clearInterval(pollTimer);
                        jQuery('body section#MLOverlayD').remove();
                        return true;
                    }
                }, 200);
                break;
                    
                case 'entypo-twitter': // Twitter
                var win = window.open('http://twitter.com/home?status='+encodeURIComponent(Core.twitterText),
                        'twitter-share-dialog',
                        'width=626,height=436');
                var pollTimer = window.setInterval(function() {
                    if (win.closed !== false) { // !== is required for compatibility with Opera
                        window.clearInterval(pollTimer);
                        jQuery('body section#MLOverlayD').remove();
                        return true;
                    }
                }, 200);
                break;
            }
        
            return true;
        });
        
        // Fade out background and toggle spinner
        Core.spinnerMgr.destroy();
        jQuery('section#MLSpinner').addClass('animated fadeOut');
        setTimeout(function() {
            jQuery('section#MLSpinner').hide();
        }, 500);
        
        // Sprites
        setTimeout(function() {
            
            // Sprite Transitions
            spriteHandler.animationStart('header.slds ul.slides li div#homepageLogo span', {
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
        
        // Add effect for welcome section
        jQuery('section.welcome div aside:first-child').addClass('active animated bounceInLeft');
        setTimeout(function() {
            jQuery('section.welcome div aside:last-child').addClass('active animated fadeIn');
        }, 800);
    }
};