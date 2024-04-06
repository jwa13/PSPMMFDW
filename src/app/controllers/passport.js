import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../firebase.ts';
import keys from './keys.js';
var User = '';
passport.use(
	new GoogleStrategy(
		{
			clientID: keys.google.clientID,
			clientSecret: keys.google.clientSecret,
			callbackURL: '/google/callback',
		},
		async function (accessToken, refreshToken, profile, cb) {
			const currentDate = new Date();
			const userRef = db.collection('users').doc(`${profile._json.email}`);
			console.log('User Ref working');
			const doc = await userRef.get();
			console.log('Doc working');
			if (!doc.exists) {
				console.log('user does not exist');
				User = {
					profileId: profile._json.sub,
					name: profile._json.name,
					email: profile._json.email,
					team: null,
					dateJoined: currentDate
				};
				userRef.set(User).then(() => {
					console.log('user created');
					cb(null, User);
				});
			} else {
				User = doc.data();
				console.log(
					`User already exists.\nDocument data for ${User.name}:`,
					User
				);
				cb(null, User);
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
			admin: user.admin,
			team: user.team,
			headCoach: user.headCoach,
			assistantCoach: user.assistantCoach,
			dateJoined: user.dateJoined
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
