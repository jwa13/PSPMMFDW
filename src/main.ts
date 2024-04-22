import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

import App from './app/app';
import IORedis from 'ioredis';
import RedisStore from 'connect-redis';

// Load values from our config.env file, if it exists
// Note: this is only really for dev convenience, you should import these differently in prod
// https://medium.com/@sushantkadam15/using-environment-variables-in-typescript-with-dotenv-dc0c35939059


// Choose the port number to run the app under
const port: number = Number(process.env.PORT) || 3000;

// Create a new app instance, tell it to start listening
const app = new App(port);
app.listen();
