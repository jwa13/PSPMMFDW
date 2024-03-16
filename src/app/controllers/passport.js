import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../firebase.ts';
import keys from './keys.js';
import dbController from './db.controller.js';

var User = '';
passport.use(
	new GoogleStrategy({
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret,
		callbackURL: '/google/callback',
	},
		async (accessToken, refreshToken, profile, cb) => {
			const userData =
			{
				profileId: profile._json.sub,
				name: profile._json.name,
				email: profile._json.email,
			};

			// Check if the user exists
			const userLoggingIn = await dbController.getUserByEmail(userData.email);
			if (userLoggingIn) {
				console.log(`[passport.use()]: User Login Success! \nDocument data for ${userLoggingIn.name}:`, userLoggingIn);
				cb(null, userLoggingIn);
			} else {
				// Create a new user: 
				// This will be moved to the admin profile middle ware
				// Replace with logic to handle failed login
				const newUser = await dbController.createUser(userData);
				if (newUser) {
					console.log(`[passport.use()]: New user created for ${newUser.name}`, newUser);
					cb(null, newUser);
				} else {
					cb(new Error('[passport.use()]: Failed to create a new user'), null);
				}
			}
		}
	)
);

passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, {
			id: user.profileId,
			username: user.name,
			email: user.email,
			player: user.player,
			coach: user.coach,
			parent: user.parent,
			admin: user.admin
		});
	});
});

passport.deserializeUser(function (serializedUser, cb) {
	process.nextTick(function () {
		console.log(serializedUser.id);
		db.collection('users')
			.where('profileId', '==', serializedUser.id)
			.get()
			.then((user) => {
				cb(null, user);
			});
	});
});
