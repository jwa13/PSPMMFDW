var register = function (Handlebars) {
	var helpers = {
		// put all of your helpers inside this object
		isEqual: function (a, b) {
			//console.log(`${a} is equal to ${b}: ${a === b}`);
			return a === b;
		},

		isNotNull: function (a) {
			return a !== null;
		},
	};

	if (Handlebars && typeof Handlebars.registerHelper === 'function') {
		// register helpers
		for (var prop in helpers) {
			Handlebars.registerHelper(prop, helpers[prop]);
		}
	} else {
		// just return helpers object if we can't register helpers here
		return helpers;
	}
};

module.exports.register = register;
module.exports.helpers = register(null);
