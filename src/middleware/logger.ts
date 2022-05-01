import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';

export default function routeLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
    });
  });

  next();
}
