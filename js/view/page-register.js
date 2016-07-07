define([
    'zepto',
    'mobiscroll',
    'settings',
    'lib/tap',
    'lib/history',
    'lib/observer',
	'lib/lang',    
	'model/user',
	'view/page',
    "text!html/page-register.html"
], function($, mobiscroll, settings, tap, history, observer, lang, user, Page, html) {
	'use strict';
	console.log("loading module 'view/page-register'...");
    
	function PageRegister (id) {
        var $page       = $(html),
            $step0      = $(".step0", $page),
            $step1      = $(".step1", $page),
            $email      = $("[name='email']", $page),
            $name       = $("[name='name']", $page),
            $type       = $(".md-select", $page),
            $register   = $(".mbsc-btn-block", $step0),
            $retry      = $(".mbsc-btn-block", $step1),
			club		= settings.read("user.club"),
            that        = this,
            mbscType;
        
        lang ($page);
        
        $page.appendTo("body");
        	
		this.show = function(params) {
			console.log("Page: show(page-register)");				
			$page.addClass("ui-page-active");
		};        
        
		this.refresh = function () {
			console.log("page-register: refresh()");
            
            $email.val(user.email||"");
            $name.val(user.name||"");

            //console.log("sex:" + user.sex);
            if (user.sex == 'male')        
                $(".male", $page).prop("checked", true);
            else
                $(".female", $page).prop("checked", true);            
            
            if (settings.read("app.register")) {
                $step0.hide();
                $step1.show();
            }
            else {
                $step0.show();
                $step1.hide();
            } 
                  
		};	
       
        mobiscroll.form($page, { theme: 'volleyball-green' });		               
                
        mbscType = mobiscroll.select($type, {
            theme: 'volleyball-green',
            display: 'bottom',
            onInit: function(e, inst) {
                inst.setVal(user.type);
            },            
            buttons: [ 
                { 
                    text: 'Ok',
                    handler: 'set'
                }
            ]            
        });              
            
        $register.on("click", function(ev) {     
            //console.log("tap retry");   
            var email   = $email.val(),
                name    = $name.val(),
                sex     = $("[name='sex']:checked", $page).val(),
                type    = $type.val();               
               
            $(".mbsc-err-msg").hide();
           
            if (email == "") {
                $(".email-empty", $page).show();
            }
            else if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) == false) {
                $(".email-invalid", $page).show();
            }
            else if (name == "") {
                  $(".name-empty", $page).show();
            }
            else {
                 //console.log(club);
                 $(".user-email", $page).html(email);
                 user.register(email, name, club, sex, type);         
                 that.refresh();
            }
        });   
        
        $("input", $page).on("focus", function() {
            $(".mbsc-err-msg", $(this).parent()).hide();
        });

        $retry.on("click", function(ev) {         
            console.log("tap retry");
            settings.write("app.register", 0);
            that.refresh();
            return false;
        });      
            
        /*
            Subscripitions
        */        		
		observer.subscribe("user/active", function(e, state) {
			console.log("page-register: event 'user/active' received..."); 
            if (state) {
                require(["view/page-main"], function(pageMain) { 
                    pageMain.open();
                });           
            } 
		});	            
        
        this.refresh();      			
	}	
	
	PageRegister.prototype = Object.create(Page.prototype);
	PageRegister.prototype.constructer = PageRegister;
	
	return new PageRegister('page-register');
});

