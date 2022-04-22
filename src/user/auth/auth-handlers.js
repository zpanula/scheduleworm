import express from 'express';
import { loginSchema, registerSchema } from '../user-model.js';
import { read, create, login } from '../user-service.js';
import validate from '../../middleware/validate.js';
import logger from '../../config/logger.js';

const router = express.Router();

router.post('/register', validate(registerSchema), async (req, res) => {
  const { username, email, password } = req.body;
  const user = await read(username);
  if (user) return res.status(400).send('User already registered.');

  try {
    await create(username, email, password);
  } catch (ex) {
    logger.error(ex.message);
    res.status(500).send('Account creation failed.');
  }
  return res.send('Account successfully created.');
});

router.post('/login', validate(loginSchema), async (req, res) => {
  const user = await read(req.body.username);
  if (!user) return res.status(400).send('Invalid username or password.');

  const token = await login(req.body.username, req.body.password)
    .then((e) => e)
    .catch((ex) => res.status(400).send(ex.message));
  return res
    .cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .send('Logged in successfully.');
});

router.get('/logout', (req, res) =>
  res.clearCookie('access_token').send('Successfully logged out.')
);

export default router;
