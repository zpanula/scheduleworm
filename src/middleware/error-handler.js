import logger from '../config/logger.js';

export default function handleError(err, res) {
  logger.error(err);

  if (!err.isOperational) {
    // Shut down the application if it's not an AppError
    process.exit(1);
  }

  res.status(err.statusCode).send(err.message);
}
