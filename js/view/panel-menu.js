define([
	'zepto',
    'settings',
	'lib/history',
    'lib/observer',
    'lib/tap',    
    'model/user',
	'view/panel',
    "text!html/panel-menu.html",    
	'mobiscroll'
], function($, settings, history, observer, tap, user, Panel, html) {
	'use strict';
	
	console.log("loading module 'view/panel-menu'...");
	
	// Cache
    var $html       = $(html),
        $header     = $(".header", $html),
        $name       = $(".name", $header),
        $club       = $(".club", $header),
        $listItems  = $(".lv-item", $html);
	
    $name.html(user.name);
    $club.html(settings.read("app.club"));
    
	function PanelMenu (id) {

		Panel.call(this, id, $html);

		tap.on($listItems, function(e) {
            var item = $(this);	

            history.back();
            
            switch(item.data("id")) {
                case 'calendar':	require([
                                        'view/page-calendar'
                                    ], function(pageCalendar) {
                                        pageCalendar.show(); 
                                    });
                                    break;
                case 'terms':	    require([
                                        'view/page-terms'
                                    ], function(pageTerms) {
                                        pageTerms.show(); 
                                    });
                                    break;                                    
                case 'profile':	    require([
                                        'view/page-profile'
                                    ], function(pageProfile) {
                                        pageProfile.open(); 
                                    });
                                    break;
                case 'faq':	        require([
                                        'view/page-faq'
                                    ], function(pageFaq) {
                                        pageFaq.show(); 
                                    });
                                    break;
                case 'exit':		if ('navigator' in window && window.navigator.app)
                                        navigator.app.exitApp();
                                    break;
            }
            
            return false;
		});
        
        /*
            Tap events
        */    
        
        /*
            Subscripitions
        */        		        
		observer.subscribe("user/name", function(e, name) {
			console.log("panel-menu: event 'user/name' received...");
            $name.html(name);
		});	          
	}	
	
	PanelMenu.prototype 			= Object.create(Panel.prototype);
	PanelMenu.prototype.constructer = PanelMenu;
	
	return new PanelMenu('panel-menu');
});