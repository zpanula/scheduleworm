import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import User from './user-model.js';
import logger from '../config/logger.js';
import AppError from '../config/error.js';

/**
 * Creates a new user
 * @param {string} email
 * @param {string} password
 * @return {Object}
 */
export async function create(username, email, password) {
  const user = User.build({ username, email, password });

  try {
    await user.save();
    logger.info(`Created user ${username} : ${email}`);
    return user;
  } catch (err) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
}

/**
 * Returns a single user
 * @param {string} id
 * @return {Object}
 */
export async function read(username) {
  try {
    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'username', 'email', 'isAdmin'],
    });
    return user ?? null;
  } catch (err) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
}

/**
 * Returns array of users
 * @return {Array.<Object>}
 */
export async function readAll() {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'isAdmin'],
    });
    logger.debug('Read all users', users);
    return users;
  } catch (err) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
}

/**
 * Returns a single user
 * @param {string} username
 * @return {Object}
 */
export async function readByEmail(email) {
  try {
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'username', 'email', 'isAdmin'],
    });
    return user;
  } catch (err) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
}

/**
 * Generates a JWT token from a user
 * @param {Object} user
 * @return {string}
 */
function generateAuthToken(user) {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.API_SECRET_KEY
  );
  logger.debug('Generated new JWT token.', token);
  return token;
}

/**
 * Authenticates a user
 * @param {string} username
 * @param {string} password
 * @return {string} - JWT token
 */
export async function login(username, password) {
  const user = await User.findOne({ where: { username } });

  const validPassword = bcrypt.compare(password, user.password);
  if (!validPassword)
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Invalid username or password.'
    );
  logger.info(`Successful login from ${user.username}`);

  return generateAuthToken(user);
}

/**
 * Deletes a user
 * @param {string} username - Username
 * @return {Object}
 */
export async function remove(username) {
  try {
    return await User.destroy({ where: { username } });
  } catch (err) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
  }
}

/**
 * Changes a user's password
 * @param {string} username
 * @param {string} newPassword
 * @return {Object}
 */
export async function update(username, newPassword) {
  await User.update({ password: newPassword }, { where: { username } });
  logger.debug(`Changed password of ${username}`);
}

/**
 * Checks user authorization
 * @param {string} username
 * @return {boolean}
 */
export async function hasPermission(username) {
  const user = await read(username);
  if (!user) return false;

  logger.debug(`Verified admin permission for ${user.username}`);
  return user.isAdmin;
}
