/* istanbul ignore file */
const express = require('express');
const cookieParser = require('cookie-parser');
const accounts = require('./user/auth/auth-handlers.js');
const users = require('./user/user-handlers.js');
require('dotenv/config');
const connectMongoose = require('./config/database.js');
const logger = require('./config/logger.js');
const error = require('./middleware/error.js');

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

module.exports.app = app;
