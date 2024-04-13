import { Request, Response, Router, request } from 'express';
import { pino } from 'pino';
import passport from 'passport';
import controller from './router.controller';
import middleware from '../middleware/middleware';
import profileMiddleware from '../middleware/profile.middleware';
import processData from './dataController';
import evaluationMiddleware from '../middleware/evaluation.middleware';
const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
	keyFile: 'src/app/controllers/pspmmfdw-6586b-5b850d44ee32.json',
	scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});

const calendar = google.calendar({ version: 'v3', auth });

require('./passport');

export class AppController {
	public router: Router = Router();
	private log: pino.Logger = pino();

	constructor() {
		this.initializeRouter();
	}

	private initializeRouter() {
		this.router.use(passport.initialize());
		this.router.use(passport.session());
		this.router.use(middleware.flashMessages);

		// Serve the home page
		this.router.get('/', controller.home);

		this.router.get(
			'/pitchingEval',
			evaluationMiddleware.getAllPlayers,
			controller.pitchingEval
		);
		this.router.post('/pitchingEval', processData.processPitching);

		this.router.get(
			'/hittingEval',
			evaluationMiddleware.getAllPlayers,
			controller.hittingEval
		);
		this.router.post('/hittingEval', processData.processHitting);

		this.router.get(
			'/strengthEval',
			evaluationMiddleware.getAllPlayers,
			controller.strengthEval
		);
		this.router.post('/strengthEval', processData.processStrength);

		this.router.get(
			'/workout',
			evaluationMiddleware.getAllPlayers,
			controller.workout
		);
		this.router.post('/workout', processData.processWorkout);

		// Serve the calendar page
		this.router.get('/calendar', controller.calendar);

		this.router.get('/events', async (req, res) => {
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
		});

		// Serve the profile page
		this.router.get(
			'/profile',
			middleware.loginCheck,
			profileMiddleware.evalGetter,
			controller.profile
		);

		// auth login
		this.router.get('/login', controller.login);

		// auth logout
		this.router.get('/logout', controller.logout);

		// Serve the admin page
		this.router.get(
			'/admin',
			middleware.loginCheck,
			middleware.adminLoginCheck,
			controller.admin
		);
		this.router.post('/admin', processData.processAdmin);

		// Serve the teamsViewer page
		this.router.get(
			'/teams',
			middleware.loginCheck,
			middleware.headCoachLoginCheck,
			controller.teams
		);
		this.router.post('/teams', processData.processHeadCoach);

		this.router.get(
			'/teamAdd',
			middleware.loginCheck,
			middleware.headCoachLoginCheck,
			controller.teamOptions
		);
		this.router.post(
			'/teamAdd',
			processData.processNewPlayer,
			processData.processNewCoach
		);

		this.router.get(
			'/teamRemove',
			middleware.loginCheck,
			// middleware.headCoachLoginCheck,
			controller.teamRemove
		);
		this.router.post(
			'/teamRemove',
			processData.processRemovePlayer,
			processData.processRemoveCoach
		);

		//need to add a router for adding and removing a player or assistant coach to a team

		this.router.get(
			'/google',
			controller.google,
			passport.authenticate('google', {
				scope: ['email', 'profile', 'openid'],
			})
		);

		this.router.get(
			'/google/callback',
			passport.authenticate('google', { failureRedirect: '/login' }),
			controller.gCallback
		);

		this.router.post(
			'/google/callback',
			passport.authenticate('google', { failureRedirect: '/login' }),
			controller.googleCallback
		);

		// Evaluation route
		this.router.get(
			'/evaluation',
			middleware.loginCheck,
			controller.evaluation
		);
	}
}
