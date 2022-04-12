import express from 'express';
import { User, validate } from '../models/user.js';
import auth from '../middleware/auth.js';
import { read, create, login } from '../services/user-service.js';

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

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  try {
    const token = login(req.body.email, req.body.password);

    return res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .send('Logged in successfully.');
  } catch (ex) {
    return res.status(400).send('Invalid email or password.');
  }
});

router.get('/protected', auth, (req, res) =>
  res.json({ user: { email: req.email } })
);

router.get('/logout', (req, res) =>
  res.clearCookie('access_token').send('Successfully logged out.')
);
export default router;
