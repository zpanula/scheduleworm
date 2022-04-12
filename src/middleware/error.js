const logger = require('../config/logger.js');

// eslint-disable-next-line no-unused-vars
module.exports = function errorMiddleware(err, req, res, next) {
  logger.error(err);
  res.status(500).send('Internal Server Error');
};
