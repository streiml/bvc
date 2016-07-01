define([
	'zepto',
	'lib/history',
	'lib/lang'
], function($, history, lang) {
	// Class: Panel
	return function Panel(id, $html) {
		'use strict';
		this.id 	= id;
		this._view 	= $html;
		
        lang($html);
        
        $html.appendTo("body");
                
		this.position = this._view.hasClass("ui-panel-left") ? 'left' : 'right';	
		
		// add dissmiss area for this panel
		this._dismiss 	= $( "<div class='ui-dismiss ui-" + this.id +  "-dismiss'></div>" )
						.on( "click", function(e) {						
							history.back();
							return false;
						})
						.appendTo("body");	
		this.show = function() {
			if (!history.isActive(this))
				history.push(this);

			console.log("Panel: show(" + this.id + ")");	
			this._view.addClass("ui-panel-open");
			this._dismiss.show();
		},
		this.hide = function() {		
			if (history.isActive(this)) { 
				history.back();
				return; // do not run this function twice, because of history pop
			}
			console.log("Panel: hide(" + this.id + ")");	
			this._view.removeClass("ui-panel-open");
			this._dismiss.hide();	
		}						
	}
});