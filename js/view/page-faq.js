define([
    'zepto',
    'lib/tap',
    'lib/history',
	'view/page',
    "text!html/page-faq.html",
], function($, tap, history, Page, html) {
	'use strict';
	console.log("loading module 'view/page-faq'...");
    
	function PageFaq (id) {
        var $page       = $(html),
            $btnBack    = $(".mbsc-ic-material-arrow-back", $page);
        
		Page.call(this, id, $page);
        
		this.refresh = function () {
			console.log("page-faq: refresh()");
                            
		};	
        
        
        tap.on($btnBack, function(ev) {
            history.back();            
        }); 
        
        this.refresh();        			
	}	
	
	PageFaq.prototype = Object.create(Page.prototype);
	PageFaq.prototype.constructer = PageFaq;
	
	return new PageFaq('page-faq');
});

