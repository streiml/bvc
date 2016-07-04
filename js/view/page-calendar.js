define([
    'zepto',
    'mobiscroll',
    'lib/tap',
    'lib/history',
    'lib/observer',
    'model/calendar',
	'view/page',
    'view/page-detail',
	'text!html/page-calendar.html'  
], function($, mobiscroll, tap, history, observer, calendar, Page, pageDetail, html) {
	'use strict';
   	console.log("loading module 'view/page-calendar'...");

	function PageCalendar (id) {
        var $html       = $(html),
            $btnBack 	= $(".mbsc-ic-material-arrow-back", $html),
            $calendar   = $("#calendar", $html),
            that        = this

        Page.call(this, id, $html);
                               		
        this.refresh = function () {
            console.log("page-calendar: refresh()");
            var events = calendar.getEvents();        
            
            this.mbscCalendar.settings.events = events;            
            this.mbscCalendar.refresh();
        };     		

		this.mbscCalendar = mobiscroll.calendar($calendar, {
			theme: 		'volleyball-green',
			display: 	'inline',
            firstDay:   1,
            lang:       'de',
			layout:  	'liquid',			
			onPosition: function(event, inst) {
               var appbar   = 56,
                   nav      = 87;
                   console.log(event.windowHeight);
			   $('.mbsc-cal-anim-c', event.target).height(Math.max(240, event.windowHeight - appbar - nav));
			},
            onBeforeShow: function (event, inst) {
                var today = new Date(),
                    month = today.getMonth(),
                    year  = today.getFullYear(); 
                calendar.setMonth(month, year);
            },
            onMonthChange: function (event, inst) {
                calendar.setMonth(event.month, event.year);
            },
            onDayChange: function(event, inst){
                calendar.setDay(event.date); 
                pageDetail.open(event.date);               
            },
            events: calendar.getEvents()
		});

        tap.on($btnBack, function(ev) {                               
            history.back();
        }); 
        

        /*
            Subscripitions
        */        		
		observer.subscribe("calendar/update", function(e, calendar) {
			console.log("page-calendar: event 'calendar/update' received...");   
            console.log(calendar);      
            that.refresh();
		});	        
	}	
	
	PageCalendar.prototype = Object.create(Page.prototype);
	PageCalendar.prototype.constructer = PageCalendar;
	
	return new PageCalendar('page-calendar');
});

