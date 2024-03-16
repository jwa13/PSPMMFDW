require('./passport');

module.exports = {
	home: async (req, res) => {
		try {
			// Render the "home" template as HTML
			const date = new Date();
			let day = date.getDate();
			let month = date.getMonth() + 1;
			let year = date.getFullYear();
			let currentDate = `${month}-${day}-${year}`;

			req.session.viewed = true;
			if(req.session.passport) {
				res.render('home', { user: req.session.passport.user, currentDate: currentDate });
				console.log(day);
			} else {
				res.render('home');
			}
			console.log('home middleware working');
		} catch (err) {
			console.log(err);
		}
	},

	calendar: (req, res) => {
		try {
			// Render the "calendar" template as HTML
			res.render('calendar');
			console.log('calendar middleware working');
		} catch (err) {
			this.log.error(err);
		}
	},

	profile: (req, res) => {
		try {
			// Render the "profile" template as HTML
			res.render('profile', { user: req.session.passport.user, evaluations: req.session.evaluations });
			console.log('profile middleware working');
		} catch (err) {
			this.log.error(err);
		}
	},

	login: (req, res) => {
		try {
			// Render the "login" template as HTML
			res.render('login');
			console.log('login middleware working');
		} catch (err) {
			this.log.error(err);
		}
	},

	google: (req, res, next) => {
		console.log('Google route working');
		console.log('google middleware working');
		next();
	},

	gCallback: (req, res) => {
		// Successful authentication, redirect to profile.
		console.log('google callback middleware working');
		res.redirect('/');
	},

	googleCallback: (req, res) => {
		console.log(req.session.passport.user.username + ' : Signed in.');
	},

	// Route to create evaluation
	// Delete this route and handlebars template, using buttons and modals instead
	evaluation: (req, res, next) => {
		console.log('Evaluation route working');
		console.log(req.session.passport.user.username);
		res.render('evaluation');
	}
};
