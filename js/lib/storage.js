define(function() {

	/**
	 * Extending the Local Storage Object to allow saving of objects.
	 *
	 * @param  int|string   key     object key
	 * @param  int|string   value   object value
	 * @return bool                 true|false
	 */
	Storage.prototype.setObject = function(key, value) {
		this.setItem(key, JSON.stringify(value));
	};

	/**
	 * Extending the Local Storage Object to allow returning of saved objects.
	 *
	 * @param  int|string   key     object key
	 * @return int|string           value
	 */
	Storage.prototype.getObject = function(key) {
		var value = this.getItem(key);
		try {
			return value && JSON.parse(value);
		}
		catch(e) {}
		return null;
	};

	Storage.prototype.exists = function(key) {
		return key in this;
	};
	
	return window.localStorage;
});


