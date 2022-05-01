import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import AppError from '../config/error.js';

const validateBody =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = Joi.compile(schema).validate(req.body);

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(', ');
      throw new AppError(StatusCodes.BAD_REQUEST, errorMessage);
    }

    Object.assign(req, value);
    return next();
  };

export default validateBody;
