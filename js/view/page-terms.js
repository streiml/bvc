define([
    'zepto',
    'lib/history',
    'lib/tap',
	'view/page',
    "text!html/page-terms.html"
], function($, history, tap, Page, html) {
	'use strict';
	console.log("loading module 'view/page-terms'...");
    
	function PageTerms (id) {
        var $page       = $(html),
            $btnBack    = $(".mbsc-ic-material-arrow-back", $page);
        
		Page.call(this, id, $page);
        
		this.refresh = function () {
			console.log("page-terms: refresh()");
		};	
        
        this.open = function() {            
            this.refresh();
            this.show();
        }       
        
        tap.on($btnBack, function(ev) {
            history.back();
        }); 
        
        this.refresh();        			
	}	
	
	PageTerms.prototype = Object.create(Page.prototype);
	PageTerms.prototype.constructer = PageTerms;
	
	return new PageTerms('page-terms');
});

