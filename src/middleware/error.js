import logger from '../config/logger.js';

// eslint-disable-next-line no-unused-vars
export default function errorMiddleware(err, req, res, next) {
  logger.error({ body: req.body, error: err });
  res.status(500).send('Internal Server Error');
}
