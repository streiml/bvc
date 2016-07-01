define([
	'zepto'
], function($) {
	var o = $( {} );

	return {
		"notify": function() {
			o.trigger.apply(o,arguments);	
		},
		"subscribe": function() {
			o.on.apply(o, arguments);
		},
		"unsubscribe": function() {
			o.off.apply(o, arguments);
		}
	}
});