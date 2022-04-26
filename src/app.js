import 'dotenv/config';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import cookieParser from 'cookie-parser';
import { sequelize, logger } from './config/index.js';
import { authHandler, userHandler } from './user/index.js';
import { routeLogger, handleError } from './middleware/index.js';

process.on('uncaughtException', (err) => {
  handleError(err);
});

process.on('unhandledRejection', (err) => {
  handleError(err);
});

await sequelize
  .authenticate()
  .then(logger.info('Connected to SQLite.'))
  .catch((err) => logger.error('Unable to connect to the database', err));

const app = express();

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
app.use(authHandler);
app.use('/user', userHandler);
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).send('Not Found');
});
app.use(async (err, req, res) => {
  await handleError(err, res);
});

app.get('/', (req, res) => {
  res.render('pages/index');
});

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
