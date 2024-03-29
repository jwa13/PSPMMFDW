require('passport');

module.exports = {
	loginCheck: (req, res, next) => {
		//console.log(req.body);
		if (req.session.passport) {
			let user = req.session.passport.user;
			console.log('login check');
			next();
		} else {
			console.log(req.session);
			res.redirect('/');
		}
	},

	adminLoginCheck: (req, res, next) => {
		//console.log(req.body);
		if (req.session.passport.user.admin) {
			console.log('admin login check');
			next();
		} else {
			console.log(req.session);
			res.redirect('/');
		}
	},

	headCoachLoginCheck: (req, res, next) => {
		//console.log(req.body);
		if (req.session.passport.user.headCoach) {
			console.log('head coach login check');
			next();
		} else {
			console.log(req.session.passport.user);
			res.redirect('/');
		}
	},

	// check if we need
	populateFormData: (req, res, next) => {
		res.locals.pitchingActive = req.path === '/pitchingEval';
		res.locals.hittingActive = req.path === '/hittingEval';
		res.locals.strengthActive = req.path === '/strengthEval';
		res.locals.workoutActive = req.path === '/workout';
		res.locals.user = req.session.passport.user;
		next();
	},

	flashMessages: function (req, res, next) {
		// if there's a flash message, transfer
		// it to the context, then clear it
		res.locals.flash = req.session.flash;
		delete req.session.flash;
		next();
	},
};
