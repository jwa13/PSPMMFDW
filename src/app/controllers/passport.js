import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../firebase.ts';
import dbController from './db.controller.js';
import keys from './keys.js';
import { validateUser } from '../Schemas/user.schema.ts';
import pino from 'pino';

const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        }
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
            callbackURL: '/google/callback',
        },
        async (accessToken, refreshToken, profile, cb) => {
            const currentDate = new Date();
            const userRef = db.collection('users').doc(`${profile._json.email}`);
            logger.info('User Ref working');
            const doc = await userRef.get();
            logger.info('Doc working');

            const userData = {
                profileId: profile._json.sub,
                name: profile._json.name,
                email: profile._json.email,
                joinDate: currentDate.toISOString(),
                team: null,  // Define the default team or pull from other sources if needed
                parent: false,
                player: false,
                assistantCoach: false,
                headCoach: false,
                admin: false
            };

            if (validateUser(userData)) {
                logger.info('User data is valid!');

                if (!doc.exists) {
                    logger.info('User does not exist');
                    try {
                        dbController.createUser(userData);
                        logger.info('User created', userData);
                        cb(null, userData);
                    } catch (error) {
                        logger.error('Error saving user:', error);
                        cb(error, null);
                    }
                } else {
                    logger.info(`User already exists. Document data for ${userData.name}:`, userData);
                    cb(null, userData);
                }
            } else {
                logger.error("Validation errors:", validateUser.errors);
                cb(new Error("User validation failed"), null);
            }
        }
    )
);

passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        cb(null, {
            id: user.profileId,
            username: user.name,
            email: user.email
        });
    });
});

passport.deserializeUser((serializedUser, cb) => {
    process.nextTick(() => {
        db.collection('users')
            .where('profileId', '==', serializedUser.id)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const user = userDoc.data();
                    cb(null, user);
                } else {
                    logger.error('No user found with this ID');
                    cb(new Error('No user found with this ID'), null);
                }
            })
            .catch(error => {
                logger.error('Error fetching user:', error);
                cb(error, null);
            });
    });
});
