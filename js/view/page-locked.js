define([
    'zepto',
	'view/page',
    "text!html/page-locked.html",
], function($, Page, html) {
	'use strict';
	console.log("loading module 'view/page-locked'...");
    
	function PageLocked (id) {
		this.id 	= id;
		this._view 	= $(html);        
        
        this._view.appendTo("body");
        	
		this.show = function(params) {
			console.log("Page: show(" + this.id + ")");
			$(".ui-page-active").removeClass("ui-page-active");
			this._view.addClass("ui-page-active");
		};
	}	
	
	PageLocked.prototype = Object.create(Page.prototype);
	PageLocked.prototype.constructer = PageLocked;
	
	return new PageLocked('page-locked');
});

