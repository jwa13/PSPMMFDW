import db from '../firebase';
require('./passport');

const dataController = {
	processPitching: async (req, res) => {
		console.log(req.body);
		var userEval = '';
		const evalRef = db
			.collection('evaluations')
			.doc(`${req.body.coachName}`)
			.collection(`${req.body.playerName}`)
			.doc('PitchingEval');
		const doc = await evalRef.get();
		console.log('Doc for Pitching Eval working');
		userEval = {
			teamName: req.body.teamName,
			playerName: req.body.playerName,
			moundVelo: req.body.moundVelo,
			pulldownVelo: req.body.pulldownVelo,
			comments: req.body.comments,
			date: req.body.date,
		};
		evalRef.set(userEval).then(() => {
			console.log('user created');
		});
		res.redirect('/');
	},

	processHitting: async (req, res) => {
		console.log(req.body);
		var userEval = '';
		const evalRef = db
			.collection('evaluations')
			.doc(`${req.body.coachName}`)
			.collection(`${req.body.playerName}`)
			.doc('PitchingEval');
		const doc = await evalRef.get();
		console.log('Doc for Pitching Eval working');
		userEval = {
			teamName: req.body.teamName,
			playerName: req.body.playerName,
			exitVeloTee: req.body.exitVeloTee,
			exitVeloToss: req.body.exitVeloToss,
			comments: req.body.comments,
			date: req.body.date,
		};
		evalRef.set(userEval).then(() => {
			console.log('user created');
		});
		res.redirect('/');
	},

	processStrength: async (req, res) => {
		console.log(req.body);
		var userEval = '';
		const evalRef = db
			.collection('evaluations')
			.doc(`${req.body.coachName}`)
			.collection(`${req.body.playerName}`)
			.doc('PitchingEval');
		const doc = await evalRef.get();
		console.log('Doc for Pitching Eval working');
		userEval = {
			teamName: req.body.teamName,
			playerName: req.body.playerName,
			squat: req.body.squat,
			bench: req.body.bench,
			deadlift: req.body.deadlift,
			comments: req.body.comments,
			date: req.body.date,
		};
		evalRef.set(userEval).then(() => {
			console.log('user created');
		});
		res.redirect('/');
	},

	processWorkout: async (req, res) => {
		console.log(req.body);
		var userEval = '';
		const evalRef = db
			.collection('evaluations')
			.doc(`${req.body.coachName}`)
			.collection(`${req.body.playerName}`)
			.doc('PitchingEval');
		const doc = await evalRef.get();
		console.log('Doc for Pitching Eval working');
		userEval = {
			teamName: req.body.teamName,
			playerName: req.body.playerName,
			sets: req.body.sets,
			reps: req.body.reps,
			weight: req.body.weight,
			comments: req.body.comments,
			exampleVideo: req.body.exampleVideo,
			date: req.body.date,
		};
		evalRef.set(userEval).then(() => {
			console.log('user created');
		});
		res.redirect('/');
	},

	processAdmin: async (req, res) => {
		const adminRef = db.collection('users').doc(`${req.body.email}`);
		const doc = await adminRef.get();
		var userStatus = {
			coach: req.body.coachCheck,
			player: req.body.playerCheck,
			parent: req.body.parentCheck,
			admin: req.body.adminCheck,
		};
		console.log(req.body);
		adminRef.set(userStatus, { merge: true }).then(() => {
			console.log('user assigned role');
		});
		res.redirect('/');
	},

	processTeam: async (req, res) => {
		const teamsRef = db.collection('team').doc(`${req.body.newTeam}`);
		const doc = await teamsRef.get();
		const UserRef = db.collection('users');
		const Userdoc = await UserRef.get();
		var newTeam = {
			teamName: req.body.newTeam,
			coach: req.body.headCoach,
		};

		teamsRef.set(newTeam, { merge: true }).then(() => {
			console.log('new team created');
		});
		res.redirect('/teams');
	},

	// make processPlayer
};

export default dataController;
