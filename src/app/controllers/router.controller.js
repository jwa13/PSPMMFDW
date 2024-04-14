require('./passport');
import { P } from 'pino';
import db from '../firebase';

const routerController = {
	home: async (req, res) => {
		try {
			// Render the "home" template as HTML

			if (req.session.passport) {
				console.log(req.session.passport.user);
				res.render('home', {
					user: req.session.passport.user,
				});
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

	//NEED TO ADD
	//ATTENDEE = NULL MEANS PUBLIC EVENT
	// IF ATTENDEES INCLUDES USER OR ATTENDEE = null
	// 	FILTER EVENTS
	events: async (req, res) => {
		try {
			// Specify the calendar ID for which you want to retrieve events
			const calendarId =
				'c_3f89c65c96906b0e35da55a80a8ecd7ba5babdd9d54f4fdaddb1da6230766718@group.calendar.google.com';

			// Fetch events from the calendar
			const response = await calendar.events.list({
				calendarId,
				timeMin: new Date().toISOString(),
				singleEvents: true,
				orderBy: 'startTime',
			});

			const events = response.data.items;
			res.json(events);
		} catch (error) {
			console.error('Error fetching events:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},

	schedule: async (req, res) => {
		try {
			console.log(req.session.passport.user);
			var teams = [];
			var tempTeams = [];
			var players = [];
			var coaches = [];
			const UserRef = db.collection('users');
			const snapshotPlayer = await UserRef.where('player', '!=', false).get();
			const snapshotHeadCoach = await UserRef.where(
				'headCoach',
				'!=',
				false
			).get();
			const snapshotCoach = await UserRef.where('coach', '!=', false).get();
			if (snapshotPlayer.empty) {
				console.log('No matching documents for players.');
			}
			snapshotPlayer.forEach((doc) => {
				players.push(doc.data());
			});

			if (snapshotHeadCoach.empty) {
				console.log('No matching documents for head coaches.');
			}
			snapshotHeadCoach.forEach((doc) => {
				if (doc.data().team) {
					tempTeams.push(doc.data().team);
				}
			});

			if (snapshotCoach.empty) {
				console.log('No matching documents for coaches.');
			}
			snapshotCoach.forEach((doc) => {
				coaches.push(doc.data());
			});

			let duplicate;
			for (let i = 0; i < tempTeams.length; i++) {
				duplicate = false;
				for (let j = 0; j < teams.length; j++) {
					if (tempTeams[i] === teams[j]) {
						duplicate = true;
					}
				}
				if (!duplicate) {
					teams.push(tempTeams[i]);
				}
			}
			// Render the "schedule" template as HTML
			res.render('schedule', {
				user: req.session.passport.user,
				players: players,
				coaches: coaches,
				teams: teams.sort(),
			});
			console.log('schedule middleware working');
		} catch (err) {
			console.log(err);
		}
	},

	profile: (req, res) => {
		try {
			// Render the "profile" template as HTML
			res.render('profile', {
				user: req.session.passport.user,
				evaluations: req.session.evaluations,
			});
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

	admin: async (req, res) => {
		try {
			const usersRef = db.collection('users');
			const emails = [];
			await usersRef
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						// Extract the "name" field from each document
						emails.push({ email: doc.data().email });
					});
					// Do whatever you want with the names here
				})
				.catch((error) => {
					console.error('Error fetching documents: ', error);
				});
			// Render the "admin" template as HTML
			res.render('admin', {
				emails: emails,
			});
			console.log('admin middleware working');
		} catch (err) {
			console.log(err);
		}
	},

	teams: async (req, res, next) => {
		try {
			var teams = [];
			var tempTeams = [];
			var players = [];
			var playersAssigned = [];
			const UserRef = db.collection('users');
			const snapshotPlayer = await UserRef.where('player', '!=', false).get();
			const snapshotCoach = await UserRef.where('headCoach', '!=', false).get();
			if (snapshotPlayer.empty) {
				console.log('No matching documents.');
			}
			snapshotPlayer.forEach((doc) => {
				if (doc.data().team == null) {
					players.push(doc.data());
				} else {
					playersAssigned.push(doc.data());
				}
			});

			if (snapshotCoach.empty) {
				console.log('No matching documents.');
			}
			snapshotCoach.forEach((doc) => {
				if (doc.data().team) {
					tempTeams.push(doc.data().team);
				}
			});
			console.log(playersAssigned);

			let duplicate;
			for (let i = 0; i < tempTeams.length; i++) {
				duplicate = false;
				for (let j = 0; j < teams.length; j++) {
					if (tempTeams[i] === teams[j]) {
						duplicate = true;
					}
				}
				if (!duplicate) {
					teams.push(tempTeams[i]);
				}
			}

			console.log(teams.sort());

			// Render the "teamsViewer" template as HTML
			res.render('teamsViewer', {
				teams: teams.sort(),
				players: playersAssigned,
			});

			console.log('teams viewer middleware working');
		} catch (err) {
			console.log(err);
		}
	},

	teamOptions: async (req, res, next) => {
		try {
			var players = [];
			var coaches = [];
			const UserRef = db.collection('users');
			const snapshotPlayers = await UserRef.where('player', '!=', false).get();
			const snapshotCoaches = await UserRef.where('coach', '!=', false).get();
			if (snapshotPlayers.empty) {
				console.log('No matching documents.');
			}
			snapshotPlayers.forEach((doc) => {
				if (doc.data().team == null) {
					players.push(doc.data());
				}
			});
			if (snapshotCoaches.empty) {
				console.log('No matching documents.');
			}
			snapshotCoaches.forEach((doc) => {
				if (doc.data().team == null) {
					coaches.push(doc.data());
				}
			});
			// console.log(players);
			console.log(coaches);
			res.render('teamOptions', {
				players: players,
				coaches: coaches,
			});
		} catch (err) {
			console.log(err);
		}
	},

	teamRemove: async (req, res, next) => {
		try {
			var players = [];
			var coaches = [];
			const UserRef = db.collection('users');
			const snapshotPlayers = await UserRef.where('player', '!=', false).get();
			const snapshotCoaches = await UserRef.where('coach', '!=', false).get();
			if (snapshotPlayers.empty) {
				console.log('No matching documents.');
			}
			snapshotPlayers.forEach((doc) => {
				if (doc.data().team == req.session.passport.user.team) {
					players.push(doc.data());
				}
			});
			if (snapshotCoaches.empty) {
				console.log('No matching documents.');
			}
			snapshotCoaches.forEach((doc) => {
				if (doc.data().team == req.session.passport.user.team) {
					coaches.push(doc.data());
				}
			});
			// console.log(players);
			console.log(coaches);
			res.render('teamRemove', {
				players: players,
				coaches: coaches,
			});
		} catch (err) {
			console.log(err);
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
		res.render('evaluation');
	},

	pitchingEval: (req, res, next) => {
		try {
			const date = new Date();
			let day = date.getDate();
			let month = date.getMonth() + 1;
			let year = date.getFullYear();
			let currentDate = `${month}-${day}-${year}`;
			res.render('pitchingEval', {
				user: req.session.passport.user,
				currentDate: currentDate,
				players: req.session.players,
			});
			console.log('pitchingEval middleware working');
		} catch (err) {
			this.log.error(err);
		}
	},

	hittingEval: (req, res, next) => {
		try {
			const date = new Date();
			let day = date.getDate();
			let month = date.getMonth() + 1;
			let year = date.getFullYear();
			let currentDate = `${month}-${day}-${year}`;
			// Render the "calendar" template as HTML
			res.render('hittingEval', {
				user: req.session.passport.user,
				currentDate: currentDate,
				players: req.session.players,
			});
			console.log('hittingEval middleware working');
		} catch (err) {
			this.log.error(err);
		}
	},

	strengthEval: (req, res, next) => {
		try {
			const date = new Date();
			let day = date.getDate();
			let month = date.getMonth() + 1;
			let year = date.getFullYear();
			let currentDate = `${month}-${day}-${year}`;
			// Render the "calendar" template as HTML
			res.render('strengthEval', {
				user: req.session.passport.user,
				currentDate: currentDate,
				players: req.session.players,
			});
			console.log('strengthEval middleware working');
		} catch (err) {
			this.log.error(err);
		}
	},

	workout: (req, res, next) => {
		try {
			const date = new Date();
			let day = date.getDate();
			let month = date.getMonth() + 1;
			let year = date.getFullYear();
			let currentDate = `${month}-${day}-${year}`;
			// Render the "calendar" template as HTML
			res.render('workout', {
				user: req.session.passport.user,
				currentDate: currentDate,
				players: req.session.players,
			});
			console.log('workout middleware working');
		} catch (err) {
			this.log.error(err);
		}
	},

	logout: (req, res, next) => {
		req.logout(function (err) {
			if (err) {
				return next(err);
			}
			res.redirect('/login');
		});
	},
};

export default routerController;
