define([
	'zepto',
	'lib/history',
    'lib/observer',
	'lib/lang'
], function($, history, observer, lang) {
	'use strict';

	// Class: Page
	return function Page(id, $html) {
		this.id 	= id
		this._view 	= $html;
        
        lang ($html);
        
        $html.appendTo("body");
        	
		this.show = function(params) {
			console.log("Page: show(" + this.id + ")");
            
            observer.notify(this.id + "/show", this);
            
			if (!history.isActive(this))
				history.push(this);
				
			$(".ui-page-active").removeClass("ui-page-active");
			this._view.addClass("ui-page-active");
		};
		
		this.hide = function() {
			console.log("Page: hide(" + this.id + ")");

            observer.notify(this.id + "/hide", this);

			if (history.isActive(this)) 
				history.pop();

			this._view.removeClass("ui-page-active");			
		};
	};

});