import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import 'dotenv/config';
import { hasPermission } from '../user/user-service.js';
import AppError from '../config/error.js';

interface TokenInterface {
  id: number;
  username: string;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.access_token;
  if (!token)
    return res
      .status(StatusCodes.FORBIDDEN)
      .send('Access denied. No token provided.');

  try {
    const data: TokenInterface = jwt.verify(
      token,
      process.env.API_SECRET_KEY as string
    ) as TokenInterface;
    res.locals.username = data.username;
    return next();
  } catch (err) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid token.');
  }
}

export function authorize(_req: Request, res: Response, next: NextFunction) {
  const { username } = res.locals;
  if (!username)
    throw new AppError(StatusCodes.FORBIDDEN, 'User is not logged in.');

  if (!hasPermission(username)) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is not an admin.');
  }

  return next();
}
