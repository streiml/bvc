define([
	'zepto',
	'lib/storage',
], function($, storage) {
	console.log("loading module 'model/database'...");
        /*
            Funktion: 		getMembers
            Beschreibung:	Liefert die Teilnehmer eines Termins. Bei einer Serie werden die Teilnehmer 
                            von Tag 0 und Tag X verschmolzen.
                            o:g:0:m		 	{1: -3,       3: null }
                            o:g:d:m 		{1: -5, 2: 2, 3: 1    }
                            ---------------------------------------
                            Ergebnis:		{1: -5, 2: 2, 3: 1    }
            Parameter:		-
            Return:			(Objekt)	Alle Teilnehmer
        */			
	Storage.prototype.readMembers = function(owner, guid, day) {
			// Versuchen die Teilnehmer der Serie zu lesen,
			// ansonsten leeres Objekt erzeugen (keine Serie, nur Termin)
			var m    = this.getObject(owner + ':' + guid + ':0:m') || {};
                
			if (day > 0) {
                // Um die Teilnehmer an diesem Tag erweitern
				var md   = this.getObject(owner + ':' + guid + ':' + day  + ':m') || {};

                for (var keys = Object.keys(md), k = keys.length, id = null; k-- ;) {
                    id = keys[k];
                    m[id] = md[id];
                }  
			}
			return m;
	};
        

	Storage.prototype.readItem = function(owner, guid, day, attr) {
			return this.getItem(owner + ':' + guid + ':' + day + ':' + attr) || this.getItem(owner + ':' + guid + ':0:' + attr) || null;
	};

	Storage.prototype.readObject = function(owner, guid, day, attr) {
			return this.getObject(owner + ':' + guid + ':' + day + ':' + attr) || this.getObject(owner + ':' + guid + ':0:' + attr) || null;
	};

	Storage.prototype.writeItem = function(owner, guid, day, attr, value) {
			this.setItem(owner + ':' + guid + ':' + day + ':' + attr, value);
	};
	
	Storage.prototype.writeObject = function(owner, guid, day, attr, obj) {
			this.setObject(owner + ':' + guid + ':' + day + ':' + attr, obj);
	};
	
	Storage.prototype.remove = function(owner, guid, day, attr) {
			this.removeItem(owner + ':' + guid + ':' + day + ':' + attr);
	}
      
	
	return window.localStorage;	
});