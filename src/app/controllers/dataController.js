import db from '../firebase';
require('./passport');

const dataController = {
	processPitching: async (req, res) => {
		console.log(req.body);
		  
		const evalRef = db.collection('evaluations');
		evalRef.add({
			coach: req.body.coachName,
			userId: req.body.selectedPlayer,
			moundVelo: req.body.moundVelo,
			pulldownVelo: req.body.pulldownVelo,
			comments: req.body.comments,
			date: currentDate,
			pitching: true,
		});
		res.redirect('/');
		return evalRef;
	},

	processHitting: async (req, res) => {
		console.log(req.body);
		const currentDate = Date();
		const evalRef = db.collection('evaluations');
		evalRef.add({
			coach: req.body.coachName,
			userId: req.body.selectedPlayer,
			exitVeloTee: req.body.exitVeloTee,
			exitVeloToss: req.body.exitVeloToss,
			comments: req.body.comments,
			date: currentDate,
			hitting: true,
		});
		res.redirect('/');
	},

	processStrength: async (req, res) => {
		console.log(req.body);
		const currentDate = Date();
		const evalRef = db.collection('evaluations');
		evalRef.add({
			coach: req.body.coachName,
			userId: req.body.selectedPlayer,
			squat: req.body.squat,
			bench: req.body.bench,
			deadlift: req.body.deadlift,
			comments: req.body.comments,
			date: currentDate,
			hitting: true,
		});
		res.redirect('/');
	},

	processWorkout: async (req, res) => {
		console.log(req.body);
		const workoutRef = db.collection('workouts')
		workoutRef.add({
			coach: req.body.coachName,
			userId: req.body.selectedPlayer,
			exercise: req.body.exercise,
			sets: req.body.sets,
			reps: req.body.reps,
			weight: req.body.weight,
			comments: req.body.comments,
			video: req.body.exampleVideo
		});
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
};

export default dataController;
