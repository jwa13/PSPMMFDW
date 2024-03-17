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
};

export default dataController;
