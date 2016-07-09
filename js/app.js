define([
	'zepto',
	'mobiscroll',
    'settings',
	'lib/history',
	'lib/observer',
	'lib/lang'
], function($, mobiscroll, settings, history, observer, lang) {
	'use strict';	
	
	// cache
	var $document 		= $(document),
                        // App Logic
                        app = {
                            isOnline: function() {
                                return true;
                                //return "connection" in window.navigator && window.navigator.connection.type != Connection.NONE;
                            }
                        };

    // lang
    lang($document);
    
	// events
	document.addEventListener("deviceready", function() {
        console.log("device ready...");
        // show main page
        if (settings.read("user.active")) {
            require(["view/page-main"], function(pageMain) { 
                pageMain.open();
            });
        }
        else {
            require(["view/page-register"], function(pageRegister) { 
                pageRegister.show();
            });            
        }
	});
	    
	$document.on("backbutton", function() {
		// always save settings dialog
		if ($(".ui-page-active").attr('id') == 'page-settings')
			history.pop();
		else					
			history.back();
	});		
		
	document.addEventListener("offline", function() {
		observer.notify("app/offline");
	});

	document.addEventListener("online", function() {
		observer.notify("app/online");
	});
	    
	// mobiscroll settings
	mobiscroll.setDefaults({
		theme: 'volleyball-green'
	});	
    
    /*
        Subscripitions
    */        		
    observer.subscribe("user/logout", function(e, state) {
        console.log("app: event 'user/logout' received...");
        localStorage.clear(); 
        require(["view/page-register"], function(pageRegister) { 
            pageRegister.show();
        });            
    });	 
            	
	$document.trigger('mbsc-enhance');
	//$document.trigger('deviceready');
	
    return app;	
});
