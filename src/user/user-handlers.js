import express from 'express';
import { userSchema } from './user-model.js';
import { authenticate, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { read, readAll, remove, update } from './user-service.js';

const router = express.Router();

router.get('/', authenticate, authorize, async (req, res) => {
  if (req.body.username) {
    const user = await read(req.body.username);
    if (!user) return res.status(400).send('User does not exist.');
    return res.send(user);
  }

  const users = await readAll();

  return res.send(users);
});

router.delete(
  '/',
  validate(userSchema),
  authenticate,
  authorize,
  async (req, res) => {
    const user = await read(req.body.username);
    if (user === null) return res.status(400).send('User does not exist.');

    await remove(req.body.username);
    return res.send('User deleted.');
  }
);

router.put(
  '/',
  validate(userSchema),
  authenticate,
  authorize,
  async (req, res) => {
    const user = await read(req.body.username);
    if (!user) return res.status(400).send('User does not exist.');

    await update(req.body.username, req.body.password);

    return res.send('Password successfully changed.');
  }
);
export default router;
