import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/error.middleware.js';
const app = express();

// built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// third party middlewares
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

// health-check
app.get('/ping', (_req, res) => {
  console.log('pong');
  res.send('Pong');
});

// custom Error middleware
app.use(errorMiddleware);

// default catch all route - 404
app.all('*', (_req, res) => {
  res.send('OOps!!! 404 Not Found');
});

export default app;
