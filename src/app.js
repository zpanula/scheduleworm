/* istanbul ignore file */
import express from 'express';
import cookieParser from 'cookie-parser';
import accounts from './user/auth/auth-handlers.js';
import users from './user/user-handlers.js';
import 'dotenv/config';
import connectMongoose from './config/database.js';
import logger from './config/logger.js';
import error from './middleware/error.js';

process.on('uncaughtException', (err) => {
  logger.error(err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error(err);
  process.exit(1);
});

connectMongoose();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static('./src/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(accounts);
app.use('/user', users);
app.use(error);

app.get('/', (req, res) => {
  res.render('pages/index');
});

const port = process.env.API_PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
