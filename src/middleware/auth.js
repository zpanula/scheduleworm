import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import 'dotenv/config';
import { userService } from '../user/index.js';
import { AppError } from '../config/index.js';

export function authenticate(req, res, next) {
  const token = req.cookies.access_token;
  if (!token)
    return res
      .status(StatusCodes.FORBIDDEN)
      .send('Access denied. No token provided.');

  try {
    const data = jwt.verify(token, process.env.API_SECRET_KEY);
    req.username = data.username;
    res.locals.username = data.username;
    return next();
  } catch (err) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid token.');
  }
}

export function authorize(req, res, next) {
  const { username } = res.locals;
  if (!username)
    throw new AppError(StatusCodes.FORBIDDEN, 'User is not logged in.');

  if (!userService.hasPermission(username)) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is not an admin.');
  }

  return next();
}
