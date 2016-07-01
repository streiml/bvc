define([
	'lib/observer',
    'model/club'
], function(observer, club) {
	console.log("loading module 'model/day'...");
    
    function Day(params) {
        this.day     = params["day"];
        this.user    = params["user"];
        this.members = {};
        
        if ("members" in params && typeof params["members"] !== 'undefined')
            this.members = JSON.parse(JSON.stringify(params["members"]));

        this.time    = [0,24];
        this.active  = false;

        if (this.user in this.members) {
            this.time   = this.members[this.user];
            this.active = true;
        }
        
        this.getMembers = function() {
            return this.members;
        }

        this.setMembers = function(members) {
            this.members = members;
            observer.notify("day/update", this);
        }
        
        this.isActive = function() {
            return this.active;
        }
        
        this.setActive = function(state) {
            this.active = state;
            if (state)
                this.members[this.user] = this.time;
            else if (this.user in this.members)
                delete this.members[this.user]
                
            observer.notify("day/update", this);
        }

        this.getTime = function() {
            return this.time;
        }
        
        this.getBegin = function() {
            return this.time[0];
        }        

        this.getEnd = function() {
            return this.time[1];
        }        

        this.setBegin = function(begin) {
            this.time[0] = begin;
            if (this.user in this.members)
                this.members[this.user][0] = begin;
                            
            observer.notify("day/update", this);
        }

        this.setEnd = function(end) {
            this.time[1] = end;
            if (this.user in this.members)
                this.members[this.user][1] = end;

            observer.notify("day/update", this);
        }
        
        this.setTime = function(time) {
            this.time = time.sort(function(a,b) { return a - b; });
            if (this.user in this.members)
                this.members[this.user] = time;

            observer.notify("day/update", this);
        }        
                    
        this.getDay = function() {
            return this.day;
        }
        
        this.getUser = function() {
            return this.user;
        }
        
        this.getTimetable = function() {
            var timetable = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

            for (var email in this.members) {
                var value = this.members[email],
                    start = (value[0] > 0 && value[0] <= 24 ? value[0] : 0),
                    end   = (value[1] > 0 && value[1] <= 24 ? value[1] : 24);
                console.log(value);
                console.log(end);
                for (var i = start;i<end;i++) {
                    timetable[i].push(club.getMember(email).name); 
                }
            }
            
            return timetable;
        }          
                        
    }
    
    return Day;
});