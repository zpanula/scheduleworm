import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './user-model.js';

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
export async function create(email, password) {
  const user = new User(email, password);
  user.password = await generateHash(user.password);

  try {
    await user.save();
    return user;
  } catch (ex) {
    console.log(ex.message);
    return ex;
  }
}

/**
 * Returns a single user
 * @param {string} email
 * @return {Object}
 */
export async function read(email) {
  try {
    const user = await User.findOne({ email }).select('email isAdmin');
    return user;
  } catch (ex) {
    console.log(ex.message);
    return ex;
  }
}

/**
 * Returns array of users
 * @return {Array.<Object>}
 */
export async function readAll() {
  try {
    const users = await User.find().select('email isAdmin');
    return users;
  } catch (ex) {
    console.log(ex.message);
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
    { _id: user._id, email: user.email },
    process.env.API_SECRET_KEY
  );
  return token;
}

/**
 * Authenticates a user
 * @param {string} email
 * @param {string} password
 * @return {string} - JWT token
 */
export async function login(email, password) {
  const user = await User.findOne({ email });

  const validPassword = await bcrypt.compare(password, user.password); // TODO: Clarify variable names
  if (!validPassword) throw new Error('Invalid email or password.');

  return generateAuthToken(user);
}

/**
 * Deletes a user
 * @param {string} email - User's email
 * @return {Object}
 */
export async function remove(email) {
  const result = await User.deleteOne({ email });
  return result;
}

/**
 * Changes a user's password
 * @param {string} email
 * @param {string} newPassword
 * @return {Object}
 */
export async function update(email, newPassword) {
  await User.findOneAndUpdate(
    { email },
    {
      password: await generateHash(newPassword),
    }
  );
}

/**
 * Checks user authorization
 * @param {string} email
 * @return {boolean}
 */
export async function hasPermission(email) {
  const user = await User.find({ email });
  if (!user) throw new Error('User does not exist.');

  return user.isAdmin;
}
