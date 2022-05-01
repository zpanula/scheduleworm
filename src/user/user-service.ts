import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { User } from './user-model.js';
import logger from '../config/logger.js';
import AppError from '../config/error.js';

export async function create(
  username: string,
  email: string,
  password: string
): Promise<Object> {
  const user = User.build({ username, email, password });

  try {
    await user.save();
    logger.info(`Created user ${username} : ${email}`);
    return user;
  } catch (err: any) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
}

export async function read(username: string) {
  try {
    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'username', 'email', 'isAdmin'],
    });
    return user;
  } catch (err: any) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
}

export async function readAll() {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'isAdmin'],
    });
    logger.debug('Read all users', users);
    return users;
  } catch (err: any) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
}

export async function readByEmail(email: string) {
  try {
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'username', 'email', 'isAdmin'],
    });
    return user;
  } catch (err: any) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
}

function generateAuthToken(user: InstanceType<typeof User>): string {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.API_SECRET_KEY as string
  );
  logger.debug('Generated new JWT token.', token);
  return token;
}

export async function login(
  username: string,
  password: string
): Promise<string> {
  const user = await User.findOne({ where: { username } });
  if (!user)
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Invalid username or password.'
    );

  try {
    const validPassword = bcrypt.compare(password, user.password);
    if (!validPassword) logger.info(`Successful login from ${user.username}`);

    return generateAuthToken(user);
  } catch (err: any) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Invalid username or password.'
    );
  }
}

export async function remove(username: string): Promise<number> {
  try {
    return await User.destroy({ where: { username } });
  } catch (err: any) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
}

export async function update(
  username: string,
  newPassword: string
): Promise<void> {
  await User.update({ password: newPassword }, { where: { username } });
  logger.debug(`Changed password of ${username}`);
}

export async function hasPermission(username: string): Promise<boolean> {
  const user = await read(username);
  if (!user) return false;

  logger.debug(`Verified admin permission for ${user.username}`);
  return user.isAdmin;
}
