define([
    'zepto',
    'mobiscroll',
    'lib/tap',
    'lib/history',
    'lib/observer',
    'model/calendar',
	'view/page',
	'text!html/page-detail.html',
    "text!html/widget-changes.html",      
    'i18n!nls/messages'
], function($, mobiscroll, tap, history, observer, calendar, Page, html, htmlChanges, messages) {
	'use strict';
	console.log("loading module 'view/page-detail'...");
    
	function PageDetail (id) {
        var $html       = $(html),
            $wgChanges  = $(htmlChanges),        
            $btnBack 	= $(".mbsc-ic-material-arrow-back", $html),
            $btnSave 	= $(".mbsc-ic-material-check", $html),
            $btnActive  = $("#btn-active", $html),
            $title      = $(".title", $html),
            $state      = $(".mbsc-desc", $html),
            $timeLabel  = $(".time", $html),
            $timeBegin  = $("#time-slider-begin", $html),	
            $timeEnd    = $("#time-slider-end", $html),	
            $timeTable  = $(".lv-timetable", $html),		
            labelText   = ["09:00", "12:00", "15:00", "18:00", "21:00"],
            updating    = false,
            info        = null,
            timeout     = null,
            that        = this,
            snapshot,
            mbscWidgetChanges;
            
        Page.call(this, id, $html);            
            
        mobiscroll.form($html, { theme: 'volleyball-orange' });
            
        this.mbscSlider = mobiscroll.slider($timeBegin, { theme: 'volleyball-orange',
                highlight: false,
                onInit: function (inst) {
                    var labels = $timeBegin.parent().find('.mbsc-progress-step-label');
                    $.each(labels, function (i, v) {							
                        $(v).text(labelText[i]); // replace labels
                    });
                }

        });       
        
        this.mbscSwitch = mobiscroll.switch($btnActive);
                
        mbscWidgetChanges = mobiscroll.widget($wgChanges, {
            theme: 'volleyball-green',
            display: 'center',
            buttons: [{
                text: 'Ja',
                handler: function(e, inst) { 
                    calendar.save(info);                   
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
            
        this.open = function(date) {            
            var time,
                that = this;
            
            $title.html(mobiscroll.util.datetime.formatDate('dd.mm.yy', date));

            info     = calendar.getEntry();
            snapshot = JSON.stringify(info);
            time     = info.getTime();
            
            this.mbscSlider.setVal([time[0]*2, time[1]*2]);                                     
            this.refresh();
            
            setTimeout(function() { that.show() }, 80);            
        }
             
       		
        this.refresh = function () {
            console.log("page-detail: refresh()");
            var timetable = info.getTimetable(),
                active    = info.isActive(),
                time      = info.getTime(),
                ul        = '',
                i         = 0,
                j         = 0,
                subtitle  = 0,
                begin,
                end,
                last;
            
            updating = true;
            if (active) {
                this.mbscSwitch.setVal(true);
                $timeLabel.removeClass("disabled");
                $timeBegin.prop("disabled", false);
                $state.html(messages["STATE.AVAILABLE"]);                       
            }
            else {
                this.mbscSwitch.setVal(false);
                $timeLabel.addClass("disabled");
                $timeBegin.prop("disabled", true);                
                $state.html(messages["STATE.OFFLINE"]);                       
            }
            
            this.updateTime(time);
                                        
            for (i = 0; i < 24; i++) {
                var entry = timetable[i].sort(),
                    len   = entry.length, 
                    hash  = JSON.stringify(entry),
                    li    = '';
                    
                if (hash != last) {
                    if (len > 0) {
                        for (j = i; j < 24; j++) {                            
                            if (hash != JSON.stringify(timetable[j].sort()))
                                break;                              
                        }

                        begin = ('0' + (9 + Math.floor(i/2))).slice(-2) + ':' + (i%2 ? '30' : '00');
                        end   = ('0' + (9 + Math.floor(j/2))).slice(-2) + ':' + (j%2 ? '30' : '00');

                        if (i < 6 && subtitle != 1) {
                            li += '<li class="subtitle">Vormittag</li>';
                            subtitle = 1;
                        }
                        else if (i >= 6 && i < 18 && subtitle != 2) {
                            li += '<li class="subtitle">Nachmittag</li>';
                            subtitle = 2;
                        }
                        else if (i >= 18 && subtitle != 3) {
                            li += '<li class="subtitle">Abend</li>';
                            subtitle = 3;
                        }
                                                                
                        li += '<li class="lv-item">'
                        +  '<div class="begin">' +  begin + '</div>'
                        +  '<div class="end">' + end + '</div>'
                        +  '<div class="title">' + len + (len > 1 ? ' Personen' : ' Person') + '</div>'
                        +  '<span class="people">'
                        +  entry.join(', ')
                        +  '</span>'
                        +  '</li>';
                        
                        ul += li;
                    }
                    last = hash; 
                }
            }
            if (ul == '')
                $timeTable.html('<li class="subtitle">' + messages["CALENDAR.EMPTY"] + '</li>');
            else
                $timeTable.html(ul);
            updating = false;              
        };    
        
        this.updateTime = function(time) {            
            time.sort(function(a,b) { return a - b; });
            
            var begin = time[0],
                end   = time[1];
                
            $timeLabel.html(    'von ' 
                              + ('0' + (9 + Math.floor(begin/2))).slice(-2) + ':' + (begin%2 ? '30' : '00') 
                              + " Uhr"
                              + " - "
                              + ('0' + (9 + Math.floor(end/2))).slice(-2) + ':' + (end%2 ? '30' : '00')
                              + " Uhr"
                           );            
        } 	       
        
        $timeBegin.on("change", function(e) {
            if (!updating) {
                clearTimeout(timeout);
                
                that.updateTime([+$timeBegin.val()/2, +$timeEnd.val()/2]);
                
                timeout = setTimeout(function() {
                    console.log("begin");
                    info.setTime([+$timeBegin.val()/2, +$timeEnd.val()/2]);            
                }, 300);
            }
            return false;                
        });

        $timeEnd.on("change", function(e) {
            if (!updating) {
                clearTimeout(timeout);
                
                that.updateTime([+$timeBegin.val()/2,this.value/2]);
                
                timeout = setTimeout(function() {
                    console.log("end");
                    info.setTime([+$timeBegin.val()/2, +$timeEnd.val()/2]); 
                }, 300);
            }
            return false;  
        });
        
        $btnActive.on("change", function(e) {
            info.setActive(this.checked);
            return false;
        });        

        tap.on($btnBack, function(ev) {
            if (JSON.stringify(info) != snapshot) {
                mbscWidgetChanges.show();
            }                            
            else {   
                history.back();
            }
        }); 
        
        tap.on($btnSave, function(ev) {
            calendar.save(info);
            history.pop();
        });
        
        /*
            Subscripitions
        */        		        
		observer.subscribe("day/update", function(e, info) {
			console.log("page-detail: event 'day/update' received...");
            that.refresh();
		});	        
	}	
	
	PageDetail.prototype = Object.create(Page.prototype);
	PageDetail.prototype.constructer = PageDetail;
	
	return new PageDetail('page-detail');
});

