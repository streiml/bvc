define([
	'lib/storage'
], function(storage) {
	return {
		settings: 	{
						"app.lang": 		"de",
                        "app.calendar":     "bvc-mank",
                        "app.club":         "BVC Mank",
						// User
                        "user.club":		"bvc-mank.at"
					},
		read: function(property) {
			return storage.getObject("settings." + property) || this.settings[property];
		},
		write: function(property, value) {
			storage.setObject("settings." + property, value);
		}
	}
});

