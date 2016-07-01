// requirejs config
require.config({
	baseUrl: "js",
	paths:{
		// custom scripts
		
		// external libraries
		"zepto": "lib/zepto.min",
		"mobiscroll": "lib/mobiscroll.custom-3.0.0-beta2.min",
		
		// languages
		"i18n": "lib/i18n",
        
        // text plugin
        "text": "lib/text",
        "html": "../html"   // relative to baseUrl
	},
	shim: {
		"zepto": {
			exports: '$'
		},
		"mobiscroll": {
			exports: "mobiscroll"
		}
	},	
	config: {		
		"i18n": {
			locale: 'de' //window.localStorage.getItem("settings.app.lang")
		}
        
	},
	deps: ['lib/date']	
});

// load app
require(["app"]);
