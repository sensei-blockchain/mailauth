import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import initRoutes from '../app/routes';

export function start() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  initRoutes(app);

  mongoose.connect('localhost:27017/mailauth', (err, done) => {
    app.listen(4333, (server) => {
      console.log('API is Initialized');
      console.log('App Name : Mail Authenticator');
      console.log('App Port : 4333');
      console.log(`Process Id : ${process.pid}`);
    });
  });
}
