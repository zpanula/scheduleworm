import express from 'express';
import { validate } from '../user-model.js';
import { read, create, login } from '../user-service.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;

  const user = await read(email);
  if (user) return res.status(400).send('User already registered.');

  try {
    await create({ email, password });
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send('Account creation failed.');
  }
  return res.send('Account successfully created.');
});

router.post('/login', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await read(req.body.email);
  if (!user) return res.status(400).send('Invalid email or password.');

  const token = await login(req.body.email, req.body.password)
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
