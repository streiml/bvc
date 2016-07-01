define([
    'zepto',
    'mobiscroll',
    'lib/tap',
    'lib/history',
	'model/user',
	'view/page',
    "text!html/page-profile.html",
    "text!html/widget-logout.html",
    "text!html/widget-changes.html"
], function($, mobiscroll, tap, history, user, Page, html, wgLogout, wgChanges) {
	'use strict';
	console.log("loading module 'view/page-profile'...");
    
	function PageProfile (id) {
        var $page       = $(html),
            $wgLogout   = $(wgLogout),
            $wgChanges  = $(wgChanges),
            $btnSave    = $(".mbsc-ic-material-check", $page),
            $btnLogout  = $(".mbsc-btn-block", $page),
            $email      = $("[name='email']", $page),
            $name       = $("[name='name']", $page),
            $btnBack    = $(".mbsc-ic-material-arrow-back", $page),
            mbscWidgetLogout,
            mbscWidgetChanges;
        
		Page.call(this, id, $page);
        
		this.refresh = function () {
			console.log("page-profile: refresh()");
            $name.val(user.name);
            $email.val(user.email);
		};	
        
        this.open = function() {            
            this.refresh();
            this.show();
        }       

		mobiscroll.form($page, { theme: 'volleyball-green' });       
        
        mbscWidgetLogout = mobiscroll.widget($wgLogout, {
            theme: 'volleyball-green',
            display: 'center',
            buttons: [{
                text: 'Abmelden',
                handler: function(e, inst) {
                    console.log("Abmelden");
                    inst.hide();
                }
            }]          
        });
        
        mbscWidgetChanges = mobiscroll.widget($wgChanges, {
            theme: 'volleyball-green',
            display: 'center',
            buttons: [{
                text: 'Ja',
                handler: function(e, inst) {
                    user.setName($name.val());
                    inst.hide();
                    history.pop();                    
                }
            },
            {
                text: 'Nein',
                handler: function(e, inst) {
                    inst.hide();
                    history.back();                    
                }
            }]            
        });        
        
        mbscWidgetLogout.tap($btnLogout, function() {
            mbscWidgetLogout.show();
        });
        
        tap.on($btnBack, function(ev) {
            if (user.name != $name.val()) {
                mbscWidgetChanges.show();
            }
            else {
                history.back();
            }
        }); 

        tap.on($btnSave, function(ev) {
            user.setName($name.val());
            history.pop();
        }); 
        
        this.refresh();        			
	}	
	
	PageProfile.prototype = Object.create(Page.prototype);
	PageProfile.prototype.constructer = PageProfile;
	
	return new PageProfile('page-profile');
});

