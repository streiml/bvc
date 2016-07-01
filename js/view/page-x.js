define([
	'view/page'
], function(Page) {
	'use strict';
	function PageX (id) {
        var $htmlPageX = $("");
		Page.call(this, id, $htmlPageX);
		this.refresh = function () {
			console.log("page-x: refresh()");
		};		
	}	
	
	PageX.prototype = Object.create(Page.prototype);
	PageX.prototype.constructer = PageX;
	
	return new PageX('page-x');
});

