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
    getThumbnail: x0Map.avatar,
    twitterText: x0Map.twitterText,
    deepMemory: {
        'header': { 'animatingTo': 0 },
        'header ul.slides li div#homepageLogo span': { 'isAvailable': true },
        'section#MLOverlay': { 'isAvailable': true },
        'cacheImg': { 'countNumbers': 0 }
    },
    
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
    
    showTeam: function() {

        var timeOutConfig = 300;
        var timeOut = 100;
        var gravatarSize = 24;
        
        var jqueryEachSelect = [];
        jQuery.each(jQuery('footer.webApp ul li.a span a'), function(index) {
            jqueryEachSelect[index] = jQuery(this);
            setTimeout(function() {
                jQuery.cacheImage(jqueryEachSelect[index].attr('data-img') + '&s='+gravatarSize, {
                    // Complete callback is called on load, error and abort
                    complete: function(e) {
                        jqueryEachSelect[index].css({'background-image': 'url(' + jqueryEachSelect[index].attr('data-img') + '&s=' + gravatarSize + ')'}).addClass('active');
                    }
                });
            }, timeOut);
            
            timeOut = timeOut + timeOutConfig;
        });
    },
    
    // Experimental: "ScrollMeToPage"
    pageHandler: {
        isAvailable: true,
        
        load: function(type, callback) {
          if(!Core.deepMemory['section#MLOverlay']['isAvailable']) {
            return false;
          }
          Core.deepMemory['section#MLOverlay']['isAvailable'] = false;
        
          if(type == 'transition') {
            jQuery('nav.header div a').addClass('cssLoading');
            jQuery('html, body').addClass('cssLoading');
          }
            
          // Work around a strange bug
          // "Uncaught SecurityError: An attempt was made to break through the security policy of the user agent."
          //jQuery('header ul.slides li div#homepageFork ul li').hide();
            
            // Show invisible overlay
            jQuery('section#MLOverlay').show();
            jQuery('html, body').css({ scrollTop: 0 });

            //jQuery('html, body').animate({ scrollTop: 0 }, 'fast', function() {
            
            // Prevent some css bugs while rendering
            jQuery('body').addClass('canvasRendering');
            
            // Pause the slider
            jQuery('header').flexslider('pause');

            // Freeze logo sprite
            if(Core.deepMemory['header ul.slides li div#homepageLogo span']['isAvailable']) {
                Core.deepMemory['header ul.slides li div#homepageLogo span']['isAvailable'] = false;
                spriteHandler.animationContainer['header ul.slides li div#homepageLogo span'].toggle();
                spriteHandler.animationContainer['section.welcome div aside.terminal'].toggle();
            }
            
            window.html2canvas([document.body], {
                background: '#141414',
                allowTaint: true,
                taintTest: false,
                letterRendering: false,
                onrendered: function(canvas) {

                    setTimeout(function() {
                        
                        jQuery('body').removeClass('canvasRendering');
                        
                         // Set screenshot
                         jQuery('section#MLOverlay').css({
                             'background-image': 'url('+canvas.toDataURL('image/jpeg', .9)+')'
                         });
                                                
                         // Execute callback
                         if(callback !== undefined) {
                            callback();
                         }
                            
                         Core.deepMemory['section#MLOverlay']['isAvailable'] = true;
                        
                    }, 50);
                }
              });
        },
        
        finish: function(type) {
            
            jQuery('section#MLOverlay' + (type == 'alert' ? ', section#MLAlert' : '')).css({'right': jQuery(window).width()+300});
            
            // Re-enable logo sprite
            spriteHandler.animationContainer['header ul.slides li div#homepageLogo span'].toggle();
            spriteHandler.animationContainer['section.welcome div aside.terminal'].toggle();
            Core.deepMemory['header ul.slides li div#homepageLogo span']['isAvailable'] = true;
            
            setTimeout(function() {
              jQuery('html, body, nav.header div a').removeClass('cssLoading');
              jQuery('section#MLOverlay' + (type == 'alert' ? ', section#MLAlert' : '')).hide().css({'right': 0, 'background-image': 'none'});
              
                
              // Restart the slider
              jQuery('header').flexslider('play');
                
              // Then hide also alert boxes
              if(type == 'alert') {
                jQuery('section#MLAlert section').hide().removeClass('showScale');
              }

            }, 1000);
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
        
            Core.deepMemory['cacheImg']['countNumbers'] = Core.deepMemory['cacheImg']['countNumbers'] + 1;
            if(Core.deepMemory['cacheImg']['countNumbers'] != Core.backgroundImages.length) {
                return false;
            }
                                    
            // Download package menus listener
            jQuery('nav.download div button.right').on('click', function() {
                jQuery(this).addClass('active');                
                jQuery(this).on('mouseleave', function() {
                    jQuery(this).removeClass('active');
                });
            });
            
            // Slider
            jQuery('header').flexslider({
                
                animation: 'slide',
                direction: 'vertical',
                directionNav: false,
                pauseOnHover: false,
                slideshowSpeed: 6500,
                //Callback: function(slider) - Fires after each slider animation completes
                before: function(slider) {
                    
                    if(Core.deepMemory['header']['animatingTo'] == slider.animatingTo) {
                        return false;
                    }
                    
                    // Slider custom events
                    switch(slider.animatingTo) {
                            
                        // Toggle Motio on logo
                        case 0:
                        spriteHandler.animationContainer['header ul.slides li div#homepageLogo span'].toggle();
                        break;
                    }
                    
                    return true;
                },
                after: function(slider) {
                    
                    if(Core.deepMemory['header']['animatingTo'] == slider.animatingTo) {
                        return false;
                    }
                    
                    // Slider custom events
                    switch(slider.animatingTo) {
                        // Avatars animations
                        case 1:
                            jQuery('header ul.slides li div#homepageFork span.bigText').addClass('active');
                            
                            setTimeout(function() {
                                jQuery('header ul.slides li div#homepageFork span.bigText.active, header ul.slides li div#homepageFork section.repo, header ul.slides li div#homepageFork').addClass('next');
                            }, 1000);
                        break;
                            
                        // First slide
                        case 0:
                        
                        // Reset 2nd slide
                        jQuery('header ul.slides li div#homepageFork span.bigText, header ul.slides li div#homepageFork section.repo, header ul.slides li div#homepageFork').removeClass('active next');
                        
                        // Stop motio sprite
                        spriteHandler.animationContainer['header ul.slides li div#homepageLogo span'].toggle();
                        break;
                    }
                    
                    Core.deepMemory['header']['animatingTo'] = slider.animatingTo;
                    return true;
                }
                //slideshow: false
            });
                
            // Add effect for welcome section
            jQuery('section.welcome div aside:first-child').addClass('active animated bounceInLeft');
            setTimeout(function() {
                jQuery('section.welcome div aside:last-child').addClass('active animated fadeIn');
            }, 800);
            
            // Test loader
            jQuery('nav.header div a:nth-child(2)').on('click', function(e) {
                e.preventDefault();
                Core.pageHandler.load('alert', function() {
                    setTimeout(function() {
                        jQuery('section#MLAlert, section#MLAlert section.uiDocumentation').show();
                        setTimeout(function() {                        
                            jQuery('section#MLAlert section.uiDocumentation').addClass('showScale');
                        }, 20);
                    }, 10);
                });
            });
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
            jQuery('nav.header div a:nth-child(4)').on('click', function(e) {
                e.preventDefault();
                Core.pageHandler.load('alert', function() {
                    setTimeout(function() {
                        jQuery('section#MLAlert, section#MLAlert section.uiBoards').show();
                        setTimeout(function() {
                            jQuery('section#MLAlert section.uiBoards').addClass('showScale');
                        }, 20);
                    }, 10);
                });
            });
            
            // Handle <a> links
            jQuery('a[rel=x0-history]').on('click', function(e) {
                e.preventDefault();
                Core.pageHandler.load('transition', function() {
                    setTimeout(function() {
                        Core.pageHandler.finish('transition');
                    }, 3000);
                });
            });
            
            // Exit button close
            jQuery('section#MLAlert section button.close').on('click', function(e) {
                e.preventDefault();
                Core.pageHandler.finish('alert');
            });
        
            // Adding scroll detection for features animations
            var lastScrollTop = 0;
            jQuery(document).on('scroll', function() {
               var st = $(this).scrollTop();
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
            Core.deepMemory['header ul.slides li div#homepageLogo span']['isAvailable'] = true;
            jQuery('header ul.slides li div#homepageLogo span').on('click', function(e) {
                if(Core.deepMemory['header ul.slides li div#homepageLogo span']['isAvailable']) {
                    Core.deepMemory['header ul.slides li div#homepageLogo span']['isAvailable'] = false;
                    spriteHandler.animationContainer['header ul.slides li div#homepageLogo span'].toggle();
                    Core.deepMemory['header ul.slides li div#homepageLogo span']['isAvailable'] = true;
                }
            });
            
            // Warning when user try to download beta version
            jQuery('nav.download div button span.d a').on('click', function(e) {
                //e.preventDefault();
                Core.pageHandler.load('alert', function() {
                    setTimeout(function() {
                        jQuery('section#MLAlert, section#MLAlert section.uiDownload').show();
                        
                        setTimeout(function() {
                            jQuery('section#MLAlert section.uiDownload').addClass('showScale');
                        }, 20);
                    }, 10);
                });
                
                return true;
            });
            
            // Share xzero buttons
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
        }
    });
});