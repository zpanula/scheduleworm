import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import AppError from '../config/error.js';

const validateBody = (schema) => (req, res, next) => {
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
