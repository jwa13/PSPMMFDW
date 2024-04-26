import db from '../firebase';
import { Timestamp } from 'firebase-admin/firestore';
require('./passport');
const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
	keyFile: 'src/app/controllers/pspmmfdw-6586b-5b850d44ee32.json',
	scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});
const uuid = require('uuid');

const dataController = {
	processPitching: async (req, res) => {
		// console.log(req.body);
		const date = Timestamp.fromDate(new Date());
		const evalRef = db.collection('evaluations');
		evalRef.add({
			coach: req.body.coachName,
			userId: req.body.selectedPlayer,
			moundVelo: req.body.moundVelo,
			pulldownVelo: req.body.pulldownVelo,
			comments: req.body.comments,
			date: date,
			pitching: true,
		});
		res.redirect('/');
	},

	processHitting: async (req, res) => {
		// console.log(req.body);
		const date = Timestamp.fromDate(new Date());
		const evalRef = db.collection('evaluations');
		evalRef.add({
			coach: req.body.coachName,
			userId: req.body.selectedPlayer,
			exitVeloTee: req.body.exitVeloTee,
			exitVeloToss: req.body.exitVeloToss,
			comments: req.body.comments,
			date: date,
			hitting: true,
		});
		res.redirect('/');
	},

	processStrength: async (req, res) => {
		// console.log(req.body);
		const date = Timestamp.fromDate(new Date());
		const evalRef = db.collection('evaluations');
		evalRef.add({
			coach: req.body.coachName,
			userId: req.body.selectedPlayer,
			squat: req.body.squat,
			bench: req.body.bench,
			deadlift: req.body.deadlift,
			comments: req.body.comments,
			date: date,
			hitting: true,
		});
		res.redirect('/');
	},

	processWorkout: async (req, res) => {
		// console.log(req.body);
		const dateCreated = Timestamp.fromDate(new Date());
		const workoutRef = db.collection('workouts')
		const workoutID = uuid.v4();
		const restructuredData = {
			coach: req.body.coachName,
			userId: req.body.selectedPlayer,
			coachId: req.body.coachId,
			dateCreated: dateCreated,
			playerName: req.body.playerName,
			id: workoutID,
			completed: false,
			exercises: []
		}
		for(let i = 0; i < req.body.exercise.length; i++) {
			restructuredData.exercises.push({
				exercise: req.body.exercise[i],
				sets: req.body.sets[i],
				reps: req.body.reps[i],
				weight: req.body.weight[i],
				comments: req.body.commentsWorkout[i],
				video: req.body.exampleVideo[i]
			});
		}
		workoutRef.add(restructuredData);
		res.redirect('/');
	},

	processAdmin: async (req, res) => {
		const adminRef = db.collection('users').doc(`${req.body.email}`);
		const doc = await adminRef.get();
		let coachCheck = false;
		let playerCheck = false;
		let parentCheck = false;
		let adminCheck = false;

		if (req.body.coachCheck == 'true') {
			coachCheck = true;
		}
		if (req.body.playerCheck == 'true') {
			playerCheck = true;
		}
		if (req.body.parentCheck == 'true') {
			coachCheck = true;
		}
		if (req.body.adminCheck == 'true') {
			parentCheck = true;
		}
		var userStatus = {
			coach: coachCheck,
			player: playerCheck,
			parent: parentCheck,
			admin: adminCheck,
		};
		adminRef.set(userStatus, { merge: true }).then(() => {
			console.log('user assigned role');
		});
		res.redirect('/');
	},

	processHeadCoach: async (req, res, next) => {
		if (req.body.headCoach) {
			const teamRef = db.collection('users').doc(`${req.body.headCoach}`);
			const doc = await teamRef.get();
			var newTeam = {
				team: req.body.newTeam,
				headCoach: true,
			};
			teamRef.set(newTeam, { merge: true }).then(() => {
				console.log('team Created and head coach assigned');
			});
			res.redirect('/teams');
		} else {
			next();
		}
	},
	//will be hosted on a new view and will only be allowed to work if the user is a player and is not in a team
	processNewPlayer: async (req, res, next) => {
		if (req.body.newPlayer) {
			const teamRef = db.collection('users').doc(`${req.body.newPlayer}`);
			const doc = await teamRef.get();
			var newTeam = {
				team: req.body.teamOption,
			};
			teamRef.set(newTeam, { merge: true }).then(() => {
				console.log(newTeam);
				console.log('team Created and head coach assigned');
			});
			res.redirect('/teamAdd');
		} else {
			next();
		}
	},
	//will be hosted on a new view and will only be allowed to work if the user is an assistant coach and is not on a team
	processNewCoach: async (req, res, next) => {
		if (req.body.newCoach) {
			const teamRef = db.collection('users').doc(`${req.body.newCoach}`);
			const doc = await teamRef.get();
			var newTeam = {
				team: req.body.teamOption,
				assistantCoach: true,
			};
			teamRef.set(newTeam, { merge: true }).then(() => {
				console.log('team Created and head coach assigned');
			});
			res.redirect('/teamAdd');
		} else {
			next();
		}
	},

	processRemovePlayer: async (req, res, next) => {
		if (req.body.removePlayer) {
			const teamRef = db.collection('users').doc(`${req.body.removePlayer}`);
			const doc = await teamRef.get();
			var newTeam = {};
			if (doc.data().team == req.session.passport.user.team) {
				newTeam = {
					team: null,
				};
			}
			teamRef.set(newTeam, { merge: true }).then(() => {
				console.log(newTeam);
				console.log('Player Removed from Team');
			});
			res.redirect('/teamRemove');
		} else {
			next();
		}
	},
	//will be hosted on a new view and will only be allowed to work if the user is an assistant coach and is not on a team
	processRemoveCoach: async (req, res, next) => {
		if (req.body.removeCoach) {
			const teamRef = db.collection('users').doc(`${req.body.removeCoach}`);
			const doc = await teamRef.get();
			var newTeam = {};
			if (doc.data().team == req.session.passport.user.team) {
				newTeam = {
					team: null,
					assistantCoach: false,
				};
			}
			teamRef.update(newTeam).then(() => {
				console.log('Coach Removed from Team');
			});
			res.redirect('/teamRemove');
		} else {
			next();
		}
	},

	processEvents: async (req, res) => {
		const calendar = google.calendar({ version: 'v3', auth });
		try {
			var events = [];

			// NEEDS TO BE PROCESS ENV VARIABLE
			const calendarId =
				'c_3f89c65c96906b0e35da55a80a8ecd7ba5babdd9d54f4fdaddb1da6230766718@group.calendar.google.com';

			// Fetch events from the calendar
			const response = await calendar.events.list({
				calendarId,
				timeMin: new Date().toISOString(),
				singleEvents: true,
				orderBy: 'startTime',
			});
			const temp = response.data.items;
			console.log(temp[0].attendees[0].email);
			for (let i = 0; i < temp.length; i++) {
				if (temp[i].attendees) {
					for (let j = 0; j < temp[i].attendees.length; j++) {
						if (
							temp[i].attendees[j].email === req.session.passport.user.email
						) {
							events.push(temp[i]);
						}
					}
				} else {
					events.push(temp[i]);
				}
			}

			console.log(events);
			res.json(events);
		} catch (error) {
			console.error('Error fetching events:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},

	processAddEventGCalendar: (res, req, next) => {},
};

export default dataController;
