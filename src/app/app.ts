// Import the express and pino (logger) libraries
import express, { Application } from 'express';
import { pino } from 'pino';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import keys from './controllers/keys';
import bodyParser from 'body-parser';

// Import our code (controllers and middleware)
import { AppController } from './controllers/app.controller';
import { ErrorMiddleware } from './middleware/error.middleware';
import HandlebarsMiddleware from './middleware/handlebars.middleware';
import middleware from './middleware/middleware';

class App {
	// Create an instance of express, called "app"
	public app: Application = express();
	public port: number;
	private log: pino.Logger = pino();

	// Middleware and controller instances
	private errorMiddleware: ErrorMiddleware;
	private appController: AppController;

	constructor(port: number) {
		this.port = port;

		// Init the middlware and controllers
		this.errorMiddleware = new ErrorMiddleware();
		this.appController = new AppController();

		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));

		// Serve all static resources from the public directory
		this.app.use(express.static(__dirname + '/public'));

		this.app.use(cookieParser());
		this.app.use(
			session({
				secret: keys.session.secret,
				saveUninitialized: false,
				resave: false,
				cookie: {
					maxAge: 60000 * 60 * 24,
				},
			})
		);

		// Set up handlebars for our templating
		HandlebarsMiddleware.setup(this.app);

		// Tell express what to do when our routes are visited
		this.app.use(this.appController.router);
		this.app.use(this.errorMiddleware.router);
		this.app.use(middleware.populateFormData);
	}

	public listen() {
		// Tell express to start listening for requests on the port we specified
		this.app.listen(this.port, () => {
			this.log.info(
				`Express started on http://localhost:${this.port}; press Ctrl-C to terminate.`
			);
		});
	}
}

export default App;
