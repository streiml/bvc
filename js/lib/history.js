// show(): show view
// hide(): hide view
// refresh(): refresh view
define({
	// unique view id counter
	_counter: 0,
	// view stack
	_stack: [
				{
					"_history": 0,
					"show": function() {
								console.log("exit app");
								if ('navigator' in window && window.navigator.app)
									navigator.app.exitApp();
							}
				}
			],
	//unique id of active view
	_active: 0,
	// is view active
	isActive: function(view) {
		return (this._active == view._history);
	},
	// push a view on history stack
	// add flag "_history" with unique id to view object
	push: function(view) {
		'use strict';	
		if (typeof view._history == 'undefined')
			view._history = ++this._counter;
		this._active = view._history;
		console.log("History.push:" + this._active);
		this._stack[this._stack.length] = view;
	},
	// pop current view from history stack
	// default: call refresh function of previous view
	pop: function(refresh) {	
		'use strict';
		var current	= this._stack.pop() || {},
			prev	= this._stack.length > 0 ? this._stack[this._stack.length - 1] : {};
		
		// upate previous view? (default: true)
		refresh	= typeof refresh !== 'undefined' ? refresh : true;
		
		console.log("History.pop:" + this._active);		

		// set before hide, otherwise pop is loaded twice
		this._active = prev._history;

		// hide current view
		if (typeof current["hide"] == 'function') 
			current.hide();
		// refresh last view
		if (refresh && typeof prev["refresh"] == 'function')
			prev.refresh();
		// show previous view
		if (typeof prev["show"] == 'function') 
			prev.show();


	},
	// back to last view, without refreshing
	back: function() {
		this.pop(false);
	}
});