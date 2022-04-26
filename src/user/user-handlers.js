import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userSchema } from './user-model.js';
import { read, readAll, remove, update } from './user-service.js';
import { authenticate, authorize, validate } from '../middleware/index.js';
import { AppError } from '../config/index.js';

const router = express.Router();

// TODO: DRY User queries
// TODO: Add authentication middleware to the route
// Currently removed for testing.

// router.get('/', authenticate, authorize async (req, res) => {
router.get('/', async (req, res) => {
  const users = await readAll();
  res.render('user/management', { users });
});

router.get('/:username', authenticate, authorize, async (req, res) => {
  const user = await read(req.params.username);
  if (!user)
    throw new AppError(StatusCodes.BAD_REQUEST, 'User does not exist.');
  return res.send(user);
});

router.post('/delete/:username', async (req, res) => {
  await remove(req.params.username);
  return res.redirect('/user');
});

router.put(
  '/:username',
  validate(userSchema),
  authenticate,
  authorize,
  async (req, res) => {
    const user = await read(req.params.username);
    if (!user)
      throw new AppError(StatusCodes.BAD_REQUEST, 'User does not exist.');
    await update(req.params.username, req.params.password);

    return res.send('Password successfully changed.');
  }
);
export default router;
