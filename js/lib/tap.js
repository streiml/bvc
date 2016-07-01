define([
    'mobiscroll'
], function(mobiscroll) {
    
    var handler = mobiscroll.widget("<div></div>");

	return {
		"on": function($element, callback) {
            handler.tap($element, callback);
        }	
	};
});