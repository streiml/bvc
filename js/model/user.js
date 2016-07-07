define([
    'zepto',
	'settings',
    'lib/observer'
], function($, settings, observer) {
	console.log("loading module 'model/user'...");
    
    function User() {
        var db      = new PouchDB("user"),
            remote  = new PouchDB('https://couchdb-e30c29.smileupps.com/user',
                       {
                           "auth.username": "admin",
                           "auth.password": "43992a0c490c"
                       }),
            that    = this;   
                 
        this.email  = settings.read("user.email");
        this.name   = settings.read("user.name");
        this.club   = settings.read("user.club");
        this.sex   = settings.read("user.sex");
        this.type   = settings.read("user.type");
        this.active = settings.read("user.active");
        this.online = settings.read("user.online");       
        
        if (this.active && this.email) {
            db.get(this.email).then(function(doc) {
                that.name    = doc.name;
                that.sex    = doc.sex;
                that.type    = doc.type;
                that.club    = doc.club;
                that.online  = doc.online;
                that.save();            
            }).catch(function (err) {
                console.log("no user found");     
                //that.logout();            
            });                            
        }
            db.sync(remote, {
                live: true,
                retry: true,
                include_docs: true
            }).on('change', function(result) {
                // handle change                
                console.log("user: db.changes()");
                    console.log("user-result:");
                    console.log(result);

                result.change.docs.map(function (doc) { 
                    console.log(doc);
                    if (doc._id == that.email) {
                        var wasActive = that.active,
                            appkey    = settings.read("app.key"),
                            key       = "key" in doc ? doc.key : [];
                        
                        that.name    = doc.name;
                        that.sex    = doc.sex;
                        that.type    = doc.type;
                        that.club    = doc.club;
                        that.online  = doc.online;
                        
                        if (!wasActive && key.indexOf(appkey) != -1) {
                            that.active = true;
                            console.log("activate user");
                            observer.notify("user/active", true);
                        }   
                                    
                        that.save();
                    }
                });
            }).on('complete', function(info) {
                // changes() was canceled
            }).on('error', function (err) {
                console.log("change error");
                console.log(err);
            });             
                
        this.register = function (email, name, club, sex, type) {
            var key = new Date().getTime();
            
            console.log("user: register()");
            this.email = email;
            this.name = name;
            this.club = club;
            this.sex = sex;
            this.type = type;
            this.online = 0;
            this.active = false;

            this.save();
            
            settings.write("app.register", 1);
            settings.write("app.key", key);   
            
            db.get(this.email).then(function(doc) {
                //console.log("update user");
                db.put({
                        _id: email,
                        _rev: doc._rev,
                        name: name,
                        sex: sex,
                        type: type,
                        club: club,
                        online: 0
                }).then(function() {
                    that.sendMail(email, name, club, key);
                });            
            }).catch(function (err) {
                //console.log("new user");              
                db.put({
                        _id: email,
                        name: name,
                        sex: sex,
                        type: type,
                        club: club,
                        online: 0
                }).then(function() {
                    that.sendMail(email, name, club, key);
                });             
            });                      
        }
        
        this.sendMail = function(email, name, club, key) {
            console.log("user: sendMail()");
            //console.log(club);
            $.ajax({
                url: 'http://app.back2nature.at/volleyball/register.php',
                data: {
                    email:  email,
                    name:   name,
                    club:   club,
                    key:    key
                },
                success: function(data, status, xhr) {
                    //console.log(data);
                },
                error: function(xhr, errorType, error) {
                    console.log(error);
                }
            });            
        }
        
        this.save = function() {
            console.log("user: save()");
            settings.write("user.email", this.email);
            settings.write("user.name", this.name);
            settings.write("user.club", this.club);
            settings.write("user.sex", this.sex);
            settings.write("user.type", this.type);
            settings.write("user.active", this.active);
            settings.write("user.online", this.online);           
        }   
        
        this.set = function(name, sex, type) {
            console.log("user: set()");
            
            this.name = name;
            this.sex  = sex;
            this.type = type;
            
            this.save(); 
            
            db.get(this.email).then(function(doc) {
                doc.name = name;
                doc.sex = sex;
                doc.type = type;
                return db.put(doc);
            }).then(function(response) {
                //console.log("user: setName() ok");
                observer.notify("user/name", name);
            }).catch(function (err) {
                console.log(err);
            });              
        }      
                
        this.setOnline= function(state)  {
            var day = state ? new Date().getD(): 0;
            
            console.log("user: setOnline()");
            
            this.online = day;
            settings.write("user.online", this.online); 
            
            db.get(this.email).then(function(doc) {
                doc.online = day;
                return db.put(doc);
            }).then(function(response) {
                //console.log(response);
                //console.log("user: setOnline() ok")
            }).catch(function (err) {
                console.log(err);
            });            
        }
        
        this.isOnline = function() {
            return this.online == new Date().getD();
        }
        
        this.logout = function() {
            this.email   = null;
            this.name    = null;
            this.sex     = null;
            this.type    = null;
            this.club    = null;
            this.active  = null;
            this.online  = null;               
            observer.notify("user/logout");
        }
    }
    
    return new User();    
    
});