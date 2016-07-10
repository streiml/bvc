define([
    'zepto',
	'view/page',
    "text!html/page-locked.html",
], function($, Page, html) {
	'use strict';
	console.log("loading module 'view/page-locked'...");
    
	function PageLocked (id) {
        var $page       = $(html);
		Page.call(this, id, $page);
        
		this.refresh = function () {
			console.log("page-faq: refresh()");                            
		};	
	}	
	
	PageLocked.prototype = Object.create(Page.prototype);
	PageLocked.prototype.constructer = PageLocked;
	
	return new PageLocked('page-locked');
});

