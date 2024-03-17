import db from '../firebase';
require('./passport');

const dataController = {
	processPitching: async (req, res) => {
		console.log(req.body);
		res.redirect('/');
	},

	processHitting: async (req, res) => {
		console.log(req.body);
		res.redirect('/');
	},

	processStrength: async (req, res) => {
		console.log(req.body);
		res.redirect('/');
	},

	processWorkout: async (req, res) => {
		console.log(req.body);
		res.redirect('/');
	},
};

export default dataController;
