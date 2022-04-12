import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './user-model.js';

export async function generateHash(password) {
  if (!password) throw new Error('Password required.');

  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

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

export async function read(email) {
  try {
    const user = await User.findOne({ email }).select('email isAdmin');
    return user;
  } catch (ex) {
    console.log(ex.message);
    return ex;
  }
}

export async function readAll() {
  try {
    const users = await User.find().select('email isAdmin');
    return users;
  } catch (ex) {
    console.log(ex.message);
    return ex;
  }
}

export function generateAuthToken(user) {
  if (!user) throw new Error('User required.');

  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.API_SECRET_KEY
  );
  return token;
}

export async function login(email, password) {
  const user = await User.findOne({ email });

  const validPassword = await bcrypt.compare(password, user.password); // TODO: Clarify variable names
  if (!validPassword) throw new Error('Invalid email or password.');

  return generateAuthToken(user);
}

export async function remove(email) {
  const result = await User.deleteOne({ email });
  return result;
}

export async function update(email, newPassword) {
  await User.findOneAndUpdate(
    { email },
    {
      password: await generateHash(newPassword),
    }
  );
}
