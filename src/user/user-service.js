import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './user-model.js';
import logger from '../config/logger.js';

/**
 * Generates a hash from a string
 * @param {string} password - The plaintext password
 * @return {string} - The hashed password
 */
async function generateHash(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Creates a new user
 * @param {string} email
 * @param {string} password
 * @return {Object}
 */
export async function create(username, email, password) {
  const user = User.build({ username, email, password });
  user.password = await generateHash(user.password);

  try {
    await user.save();
    logger.info(`Created user ${username} : ${email}`);
    return user;
  } catch (ex) {
    logger.error(ex.message);
    return ex;
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
    }).catch(() => console.log('user not found'));
    return user ?? null;
  } catch (ex) {
    logger.error(ex.message);
    return ex;
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
  } catch (ex) {
    logger.error(ex.message);
    return ex;
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
  } catch (ex) {
    logger.error(ex.message);
    return ex;
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

  const validPassword = await bcrypt.compare(password, user.password); // TODO: Clarify variable names
  if (!validPassword) throw new Error('Invalid username or password.');
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
  } catch (ex) {
    throw new Error(ex);
  }
}

/**
 * Changes a user's password
 * @param {string} username
 * @param {string} newPassword
 * @return {Object}
 */
export async function update(username, newPassword) {
  await User.update(
    { password: await generateHash(newPassword) },
    { where: { username } }
  );
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
