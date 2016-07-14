define([
	'zepto',
    'mobiscroll',    
	'settings',    
	'lib/observer',
	'lib/tap',	
    'model/calendar',
    'model/user',
    'model/club',
	'view/page',
    "text!html/widget-welcome.html",     
    'i18n!nls/messages'    
], function($, mobiscroll, settings, observer, tap, calendar, user, club, Page, htmlWelcome, messages) {
	'use strict';
	console.log("loading module 'view/page-main'...");
	 /**
     * @exports view/page-calendar
     */
	function PageMain (id) {
		var $page   	= $("#page-main"),
            $wgWelcome  = $(htmlWelcome),   
			$btnMenu	= $(".mbsc-ic-material-menu", $page),
            $btnOnline 	= $("#btn-online", $page),
            $txtOnline  = $(".mbsc-desc", $page),
            $onlineUser = $(".lv-avatar", $page),
            $empty      = $(".empty", $page),
            $subtitle   = $(".subtitle", $page),
            users       = {},
            updating    = false,
            that        = this,
            mbscWidgetWelcome;
		
		Page.call(this, id, $page);
        
        mobiscroll.form($page, { theme: 'volleyball-orange' });           
        
        this.mbscSwitch = mobiscroll.switch($btnOnline);
        
        mbscWidgetWelcome = mobiscroll.widget($wgWelcome, {
            theme: 'volleyball-green',
            display: 'center',
            buttons: [{
                text: 'Schliessen',
                handler: 'cancel'
            }],
            onShow: function (event, inst) {
                settings.write("APP.WELCOME", true);
            }            
        });         
        
        this.open = function() {
            club.getOnlineUsers();
            if (!settings.read("APP.WELCOME")) {
                mbscWidgetWelcome.show();
            }
        }
              
        
        /*
            Functions
        */     
              
        /**
         * Aktualisiert die gesamte Ansicht      
         */   
		this.refresh = function () {
	       console.log("page-main: refresh()");      
           this.setState(user.isOnline()); 
           this.showOnlineUsers(club.users);          
		};       
        
        this.showOnlineUsers = function() {
            var headers = {
                    'lizenz': 'Lizenz',
                    'hobby': 'Hobby',
                    'nachwuchs': 'Nachwuchs',
                    'fan': 'Fan'
                },   
                html  = '',
                count = 0;
            //console.log(users);
            for (var type in users) {
                var ul = users[type].sort(),
                    len = ul.length;
                
                count += len;
                
                if (len > 0) {      
                    html += '<li class="subtitle">' + headers[type] + " (" + len + ")" + '</li>';              
                    for (var i = 0; i < len; i++)
                        html += '<li class="lv-item">' + ul[i] + '</li>';
                }                
            }
            
            $onlineUser.html(html);
            
            if (count > 0) {
                $empty.css("display", "none");
            }
            else {
                $empty.css("display", "table");
            }
        }
        
        this.setState = function(state) {
            updating = true;
            this.mbscSwitch.setVal(state);
            $txtOnline.html(state ? messages["STATE.ONLINE"] : messages["STATE.OFFLINE"]);
            updating = false;
        }        
        
        /*
            Tap events
        */    
		tap.on($btnMenu, function() {	
            require(["view/panel-menu"], function(panelMenu) {    
			     panelMenu.show("panel-menu");
            });            							
			return false;
		});
        
        $btnOnline.on("change", function() {
            // User online
            if (!updating) {
                console.log("change online state");
                user.setOnline(this.checked);
                that.setState(this.checked);
            }
        });
	
        /*
            Subscripitions
        */        		        
		observer.subscribe("user/online", function(e, result) {
			console.log("page-main: event 'user/online' received...");
            users = result;
            that.refresh();
            that.show();
		});	        	
		
       this.refresh();	
    }
    
	PageMain.prototype = Object.create(Page.prototype);
	PageMain.prototype.constructer = PageMain;
	
	return new PageMain('page-main');
});

