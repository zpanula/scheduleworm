import Joi from 'joi';
import logger from '../config/logger.js';

const validateBody = (schema) => (req, res, next) => {
  const { value, error } = Joi.compile(schema).validate(req.body);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ');
    logger.error(errorMessage);
    return res.status(400).send(errorMessage);
  }

  Object.assign(req, value);
  return next();
};

export default validateBody;
