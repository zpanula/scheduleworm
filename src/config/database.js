/* istanbul ignore file */
/* istanbul ignore file */
const mongoose = require('mongoose');
const logger = require('./logger.js');

const { MONGO_URI } = process.env;

function connectMongoose() {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      logger.info('Connected to MongoDB');
    })
    .catch((error) => {
      logger.error(error);
      process.exit(1);
    });
}

module.exports = connectMongoose;
