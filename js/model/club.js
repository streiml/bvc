define([
	'settings',
    'lib/observer'
], function(settings, observer) {
	console.log("loading module 'model/club'...");

    function Club() {
        var db      = new PouchDB("user"),
            remote  = new PouchDB('https://couchdb-e30c29.smileupps.com/user',
                       {
                           "auth.username": "admin",
                           "auth.password": "43992a0c490c"
                       }),
            that    = this;  
                 
        this.club   = settings.read("user.club");
        this.members  = {};
        
        if (this.club) {
            
            db.sync(remote, {
                live: true,
                retry: true,
                include_docs: true
            }).on('change', function(result) {
                // handle change
                console.log("club: db.changes()");

                result.change.docs.map(function (doc) {   
                    console.log(doc);              
                    var id   = doc._id,
                        club = doc.club;
                
                    if (club == that.club) {
                        that.getOnlineUsers();
                    }
                    if (id.indexOf("@") != -1) {
                        that.members[id] = doc;
                    }     
                });           
            }).on('complete', function(info) {
                console.log(info);
                // changes() was canceled
            }).on('error', function (err) {
                console.log(err);
            });
                
            db.on('error', function (err) { 
                //debugger;
                console.log(err);
            });
            
            db.allDocs({
                include_docs: true
            }).then(function (result) {
                result.rows.map(function (row) { 
                    if (row.id.indexOf("@") != -1 && that.club == row.doc.club)
                        that.members[row.id] = row.doc;
                });                     
            });                
        }
        
        this.getMember = function(id) {
            if (id in this.members)
                return this.members[id];
            return {
                _id:    id,
                name:   id,
                club:   this.club                
            };
        }        
        
        this.getOnlineUsers = function() {
            console.log("club: getOnlineUsers()");
            db.query(function(doc, emit) {  
                if (doc.key && doc.online > 0) {    
                    emit(doc.club, doc.name);
                }
            }, {
                include_docs: true,
                reduce: false
            }).then(function(result) {
                console.log("club-result:");
                console.log(result);                
                var users = {},
                    day   = new Date().getD();
                result.rows.map(function (row) { 
                    if (row.doc.online == day)
                        users[row.id] = row.value;
                });                           
                observer.notify("user/online", users);
            }).catch(function(error) {
                console.log(error);
            });
        } 
        
    }
    
    return new Club();
    
});