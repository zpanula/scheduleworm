import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { hasPermission } from '../user/user-service.js';

export function authenticate(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const data = jwt.verify(token, process.env.API_SECRET_KEY);
    req.username = data.username;
    res.locals.username = data.username;
    return next();
  } catch (ex) {
    return res.status(400).send('Invalid token.');
  }
}

export function authorize(req, res, next) {
  const { username } = res.locals;
  if (!username) return res.status(403).send('User is not logged in.');

  if (!hasPermission(username)) {
    res.status(403).send('User is not an admin.');
  }

  return next();
}
