import { logger } from '../config/index.js';

export default function routeLogger(req, res, next) {
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
    });
  });

  next();
}
