import { Request, Response, Router, request } from 'express';
import { pino } from 'pino';
import passport from 'passport';
import controller from './router.controller';
import middleware from '../middleware/middleware';
import hbs from '../middleware/handlebars.middleware';
import profileMiddleware from '../middleware/profile.middleware';
import processData from './dataController';

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

		this.router.get('/pitchingEval', controller.pitchingEval);
		this.router.post('/pitchingEval', processData.processPitching);

		this.router.get('/hittingEval', controller.hittingEval);
		this.router.post('/hittingEval', processData.processHitting);

		this.router.get('/strengthEval', controller.strengthEval);
		this.router.post('/strengthEval', processData.processStrength);

		this.router.get('/workout', controller.workout);
		this.router.post('/workout', processData.processWorkout);

		// Serve the calendar page
		this.router.get('/calendar', controller.calendar);

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
		this.router.get('/teams', middleware.loginCheck, controller.teams);
		this.router.post('/teams', processData.processHeadCoach);

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
