define([
    'mobiscroll',
    'settings',
	'lib/observer',
    'model/club',
    'model/user',
    'model/Day'
], function(mobiscroll, settings, observer, club, user, Day) {
	console.log("loading module 'model/calendar'...");
    
    function Calendar() {
        var dbName  = settings.read("app.calendar"),
            db      = new PouchDB(dbName),
            /*
            remote  = new PouchDB('https://couchdb-e30c29.smileupps.com/' + dbName,
                       {
                           "auth.username": "admin",
                           "auth.password": "43992a0c490c"
                       }),
                       */
            remote  = new PouchDB('https://couchdb.cloudno.de/' + dbName,
                       {
                           "auth.username": "gerald.streimelweger",
                           "auth.password": "volleyball"
                       }),                          
            today   = new Date(),
            that    = this;        

        this.calendar = {};
        
        if (user.active) {
            db.sync(remote, {
                live: true,
                retry: true,
                include_docs: true
            }).on('change', function(result) {
                // handle change
                console.log("calendar: db.changes()");
                //console.log(result);
                result.change.docs.map(function (doc) {
                    var id      = doc._id,
                        parts   = id.split('#'),
                        day     = parts[0],
                        user    = parts[1],
                        tokens  = day.split('-'),
                        year    = +tokens[0],
                        month   = +tokens[1],
                        members = that.calendar[day] || {};
                        
                    if ("_deleted" in doc) {
                        delete members[user];
                        that.calendar[day] = members;
                    } 
                    else if (year == that.year && (month-1) == that.month) {
                        //console.log(doc.day);
                        members[doc.user] = doc.time;
                        that.calendar[id] = members;
                    } 
                    observer.notify("calendar/update", that.calendar);                                                          
                });
            }).on('complete', function(info) {
                //console.log(info);
                // changes() was canceled
            }).on('error', function (err) {
                console.log(err);
            });
                
            db.on('error', function (err) { 
                //debugger;
                console.log(err);
            });            
        }

        this.setMonth = function(month, year) {
            console.log("calendar: setMonth()");        
            var begin = new Date(year, month, 1),
                end   = new Date(year, month + 1, 0);

            begin.setDate(-14);
            end.setDate(end.getDate() + 14);
            
            db.allDocs({
                include_docs: true,
                startkey: mobiscroll.util.datetime.formatDate('yy-mm-dd', begin),
                endkey:   mobiscroll.util.datetime.formatDate('yy-mm-dd', end)
            }).then(function (result) {
                that.calendar = {};
                result.rows.map(function (row) {
                    var doc = row.doc;
                    //console.log(doc);
                    var members = that.calendar[doc.day] || {};
                    members[doc.user] = doc.time; 
                    that.calendar[doc.day] = members; 
                });       
                //console.log("cal");
                //console.log(that.calendar);         
                observer.notify("calendar/update", that.calendar);
            }).catch(function(error) {
                console.log(error);
            });                                
            this.month = month;
            this.year  = year;
        }
        
        this.getEntry = function(day) {            
            return new Day({
               "day": typeof day !== 'undefined' ? day : this.day,
               "user": user.email,
               "members": this.calendar[this.day]  
            });
        }       
            
        this.setDay = function(date) {
            this.date  = date;
            this.day   = mobiscroll.util.datetime.formatDate('yy-mm-dd', date); 
            this.month = date.getMonth();
            this.year  = date.getFullYear();
        }
        
        this.getEvents = function() {
            var events = [];
            
            for (var d in this.calendar) {
                if (typeof this.calendar[d] !== 'undefined') {
                    var members = this.calendar[d] || {},
                        count   = Object.keys(members).length;
                                        
                    if (count > 0) {   
                        events[events.length] = {
                            d: mobiscroll.util.datetime.parseDate('yy-mm-dd', d),
                            text: count + (count > 1 ? " Pers." : " Pers."), 
                            color: (count > 3 ? 'green' : '#ccc') 
                        };
                    }
                }
            }            
            return events;
        }

        this.save = function(info) {
            var day     = info.getDay(),
                user    = info.getUser(),
                time    = info.getTime(),
                id      = day + "#" + user;
            //console.log(info);
            if (info.isActive()) {
                db.upsert(id, function(doc){
                    doc.day = day;
                    doc.user = user;
                    doc.time = time;
                    return doc;
                }).catch(function (err) {});;                
            }
            else {
                db.get(id).then(function(doc) {
                    return db.remove(doc);
                }).catch(function (err) {});
            }
        };              
        
        this.setDay(today);
    }
    
    return new Calendar();
});