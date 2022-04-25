import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { loginSchema, registerSchema } from '../user-model.js';
import { read, create, login } from '../user-service.js';
import validate from '../../middleware/validate.js';
import AppError from '../../config/error.js';

const router = express.Router();

// TODO: DRY these routes

router.post('/newuser', validate(registerSchema), async (req, res) => {
  const { username, email, password } = req.body;
  const user = await read(username);
  if (user) return res.status(400).send('User already registered.');

  try {
    await create(username, email, password);
  } catch (ex) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Account creation failed.'
    );
  }
  // return res.send('Account successfully created.');
  return res.redirect('/user');
});

router.post('/register', validate(registerSchema), async (req, res) => {
  const { username, email, password } = req.body;
  const user = await read(username);
  if (user)
    throw new AppError(StatusCodes.BAD_REQUEST, 'User already registered.');

  try {
    await create(username, email, password);
  } catch (err) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Account creation failed.'
    );
  }
  // return res.send('Account successfully created.');
  return res.redirect('/');
});

router.post('/login', validate(loginSchema), async (req, res) => {
  const user = await read(req.body.username);
  if (!user)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send('Invalid username or password.');
  try {
    const token = await login(req.body.username, req.body.password);
    return res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .send('Logged in successfully.');
  } catch (err) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
});

router.get('/logout', (req, res) =>
  res.clearCookie('access_token').send('Successfully logged out.')
);

export default router;
