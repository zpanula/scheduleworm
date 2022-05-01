import logger from '../config/logger.js';

export default function handleError(err: any, res?: any) {
  logger.error(err);

  if (!err.isOperational) {
    // Shut down the application if it's not an AppError
    process.exit(1);
  }

  res.status(err.statusCode).send(err.message);
}
