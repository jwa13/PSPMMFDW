require('passport');

module.exports = {
	loginCheck: (req, res, next) => {
		let user = req.user;
		//console.log(req.body);
		if (user) {
			console.log(user);
			next();
		} else {
			console.log(req.session);
			res.redirect('/');
		}
	},

	flashMessages: function (req, res, next) {
		// if there's a flash message, transfer
		// it to the context, then clear it
		res.locals.flash = req.session.flash;
		delete req.session.flash;
		next();
	},
};
