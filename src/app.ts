import express from 'express';
import { StatusCodes } from 'http-status-codes';
import cookieParser from 'cookie-parser';
import sequelize from './config/database.js';
import accounts from './user/auth/auth-handlers.js';
import users from './user/user-handlers.js';
import 'dotenv/config';
import logger from './config/logger.js';
import routeLogger from './middleware/logger.js';
import handleError from './middleware/error-handler.js';

process.on('uncaughtException', (err: any) => {
  handleError(err);
});

process.on('unhandledRejection', (err: any) => {
  handleError(err);
});

try {
  await sequelize.authenticate();
  logger.info('Connected to SQLite.');
} catch (err) {
  logger.error('Unable to connect to the database', err);
}

const app = express();

app.get('/', (req: any, res: any) => {
  res.render('pages/index');
});

app.get('/schedule', (req: any, res: any) => {
  res.render('pages/schedule');
});

app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static('./src/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(routeLogger);
app.use(accounts);
app.use('/user', users);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: any, res: any, next: any): void => {
  handleError(err, res);
});
app.use((req: any, res: any) => {
  res.status(StatusCodes.NOT_FOUND).send('Not Found');
});

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
