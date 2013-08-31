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
    
    webTitle: x0Map.webTitle,
    backgroundImages: x0Map.backgroundImages,
    getThumbnail: x0Map.avatar,
    twitterText: x0Map.twitterText,
    
    deepMemory: {
        'header.slds': { 'animatingTo': 0 },
        'header.slds ul.slides li div#homepageLogo span': { 'isAvailable': true },
        'nav.download div aside span.d a': { 'jqueryObject': false },
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

    pageHandler: {
        
        isAvailable: true,
        
        mainPage: '/home',
        currentPage: '',
        
        container: 'section#MLAjaxReceiver',
        
        removeQuery: function(value) {
            return (value.indexOf('?') == '-1' ? value : value.substring(0, value.indexOf('?')));
        },
        
        error: function(code) {
            switch(code) {
                case 404:
                // Oops... 404.
                // Todo: Make alert 404
                Core.pageHandler.load('alert', function() {
                    setTimeout(function() {
                        jQuery('section#MLAlert, section#MLAlert section.uiErrors').show();
                        setTimeout(function() {
                            jQuery('section#MLAlert section.uiErrors').addClass('showScale');
                        }, 20);
                    }, 10);
                });
                break;
                    
                case 403:
                    alert(403 + '!!!');
                break;
            };
        },
        
        start: function() {
            
            // Activate spinner
            Core.spinnerMgr.set();
            
            // Add :local expression
            var isLocal = new RegExp('^(' + location.protocol + '\/\/' + location.host + '|\\.|\\/|[A-Z0-9_#])', 'i');
            jQuery.expr[':'].local = function(el) {
                if(!el.attributes.href) return false;
                return isLocal.test(el.attributes.href.value);
            };
                
            // Remove spinner once all images are loaded
            jQuery.cacheImage(Core.backgroundImages, {
                    
                // Complete callback is called on load, error and abort
                complete: function(e) {
                    
                    Core.deepMemory['cacheImg']['countNumbers'] = Core.deepMemory['cacheImg']['countNumbers'] + 1;
                    if(Core.deepMemory['cacheImg']['countNumbers'] != Core.backgroundImages.length) {
                        return false;
                    }
        
                    // Fade out background and toggle spinner
                    Core.spinnerMgr.destroy();
                    jQuery('section#MLSpinner').addClass('animated fadeOut');
                    setTimeout(function() {
                        jQuery('section#MLSpinner').hide();
                    }, 500);
                    
                    // Prepare
                    var History = window.History; // We are using a capital H instead of a lower h
                    if (!History.enabled) {
                         // History.js is disabled for this browser.
                         // This is because we can optionally choose to support HTML4 browsers or not.
                        return false;
                    }
                    
                    // Exit button close
                    jQuery('section#MLAlert section button.close').on('click', function(e) {
                        e.preventDefault();
                        Core.pageHandler.finish('alert');
                    });
        
                    // Handle <a> links
                    jQuery('a:local').on('click', function(e) {
                        e.preventDefault();
                        
                        var linkOrigin = jQuery.trim(jQuery(this).attr('href'));
                        var link = Core.pageHandler.removeQuery(linkOrigin);
                        
                        if(typeof Pages[link] !== 'undefined') {
                            
                            Core.pageHandler.load('transition', function() {
                            
                                setTimeout(function() {
                                    
                                    // Push page
                                    if(History.pushState(null, 'Loading…', linkOrigin)) {
                                        Core.pageHandler.finish('transition');
                                    }
                                    
                                    return true;
                                }, 20);
                            });
                        }
                        
                        // 404
                        Core.pageHandler.error(404);
                        return false;
                    });
        
                    // Bind to StateChange Event
                    History.Adapter.bind(window, 'statechange', function() { // We are using statechange instead of popstate
                        
                        // Execute this page
                        //console.log('State changed');
                        if(typeof Pages[Core.pageHandler.removeQuery(History.getState().hash)] !== 'undefined') {
                            
                            // Remove js from old page
                            Pages[Core.pageHandler.currentPage].after();
                            
                            // Set current page
                            Core.pageHandler.currentPage = Core.pageHandler.removeQuery(History.getState().hash);
                            
                            // Do ajax request here
                            jQuery.ajax({
                              type: 'GET',
                              url: History.getState().hash,
                              //data: options.data,
                              timeout: 5000,
                              error: function(xhr, status) {
                                Core.pageHandler.error(403);
                              },
                              beforeSend: function(xhr) {
                                xhr.setRequestHeader('X-PJAX', 'true');
                              },
                              success: function(response) {

                                // Set new document title
                                document.title = /<title>((.|\n\r])*)<\/title>/im.exec(response)[1];
                                  
                                // Replace old pages
                                var body = jQuery(response).filter(Core.pageHandler.container).html();
                                jQuery(Core.pageHandler.container).html(body);
                            
                                // Run js for this page
                                Pages[Core.pageHandler.currentPage].before();
                              }
                            });
                                                        
                            return true;
                        }
                        
                        // 404
                        Core.pageHandler.error(404);
                        return false;
                    });
                    
                    // Check if hash is not empty
                    if(Core.pageHandler.removeQuery(History.getState().hash) === '/') {
                        // Set current page
                        //Core.pageHandler.currentPage = Core.pageHandler.mainPage;
                        //Pages[Core.pageHandler.currentPage].before();
                        document.location.href=Core.pageHandler.mainPage;
                        return true;
                    }
                    
                    // Execute this page
                    if(typeof Pages[Core.pageHandler.removeQuery(History.getState().hash)] !== 'undefined') {
                        // Set current page
                        Core.pageHandler.currentPage = Core.pageHandler.removeQuery(History.getState().hash);
                        
                        Pages[Core.pageHandler.currentPage].before();
                        
                        return true;
                    }
                    
                    // 404
                    Core.pageHandler.error(404);
                    return false;
                }
            });
            
            return true;
        },
        
        load: function(type, callback) {
                    
          if(!Core.deepMemory['section#MLOverlay']['isAvailable']) {
            return false;
          }
          Core.deepMemory['section#MLOverlay']['isAvailable'] = false;
        
          if(type == 'transition') {
            jQuery('nav.header div a').addClass('cssLoading');
            jQuery('html, body').addClass('cssLoading');
          }
            
            // Show invisible overlay
            jQuery('section#MLOverlay').show();
            jQuery('html, body').css({ scrollTop: 0 });

            //jQuery('html, body').animate({ scrollTop: 0 }, 'fast', function() {
            
            // Prevent some css bugs while rendering
            jQuery('body').addClass('canvasRendering');
            
            // Reset page
            if(type == 'alert' && typeof Pages[Core.pageHandler.currentPage] !== 'undefined') {
                Pages[Core.pageHandler.currentPage].after();
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
            /*spriteHandler.animationContainer['header.slds ul.slides li div#homepageLogo span'].toggle();
            spriteHandler.animationContainer['section.welcome div aside.terminal'].toggle();
            Core.deepMemory['header.slds ul.slides li div#homepageLogo span']['isAvailable'] = true;*/
            
            setTimeout(function() {
                
              jQuery('html, body, nav.header div a').removeClass('cssLoading');
              jQuery('section#MLOverlay' + (type == 'alert' ? ', section#MLAlert' : '')).hide().css({'right': 0, 'background-image': 'none'});
              
              // Restart the page
              if(type == 'alert' && typeof Pages[Core.pageHandler.currentPage] !== 'undefined') {
                Pages[Core.pageHandler.currentPage].before();
              }

              // Then hide also alert boxes
              if(type == 'alert') {
                jQuery('section#MLAlert section').hide().removeClass('showScale');
              }

            }, 1000);
        }
    }
};