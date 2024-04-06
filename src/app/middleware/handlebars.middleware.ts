// Import the express and handlebars libraries
import { Application } from 'express';
import { engine } from 'express-handlebars';

const HandlebarsMiddleware = {
	setup(app: Application) {
		// set up handlebars view engine, register w/ express
		app.engine(
			'.hbs',
			engine({
				extname: '.hbs',
				defaultLayout: 'main',
				helpers: require('./helpers').helpers,
			})
		);
		app.set('view engine', '.hbs');
		app.set('views', './views');
	},
};

export default HandlebarsMiddleware;
