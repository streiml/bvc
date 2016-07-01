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
    'i18n!nls/messages'    
], function($, mobiscroll, settings, observer, tap, calendar, user, club, Page, messages) {
	'use strict';
	console.log("loading module 'view/page-main'...");
	 /**
     * @exports view/page-calendar
     */
	function PageMain (id) {
		var $page   	= $("#page-main"),
			$btnMenu	= $(".mbsc-ic-material-menu", $page),
            $btnOnline 	= $("#btn-online", $page),
            $txtOnline  = $(".mbsc-desc", $page),
            $onlineUser = $(".lv-avatar", $page),
            $empty      = $(".empty", $page),
            users       = {},
            updating    = false,
            that        = this;
		
		Page.call(this, id, $page);
        
        mobiscroll.form($page, { theme: 'volleyball-orange' });           
        
        this.mbscSwitch = mobiscroll.switch($btnOnline);
        
        this.open = function() {
            club.getOnlineUsers();
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
            var li = [];
            for (var email in users) {
                li[li.length] = '<li class="lv-item">' + users[email] + '</li>';
            }
            li.sort();
            $onlineUser.html(li.join(''));
            
            if (li.length > 0) {
                $empty.css("display", "none");
            }
            else {
                $empty.css("display", "table");
            }
        }
        
        this.setState = function(state) {
            updating = true;
            this.mbscSwitch.setVal(state);
            $txtOnline.html(state ? messages["USER.ONLINE"] : messages["USER.OFFLINE"]);
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

