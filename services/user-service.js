import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export async function create(email, password) {
  const user = new User(email, password);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

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
    const user = await User.findOne({ email });
    return user;
  } catch (ex) {
    console.log(ex.message);
    return ex;
  }
}

function generateAuthToken(user) {
  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.API_SECRET_KEY
  );
  return token;
}

export async function login(email, password) {
  const user = await read(email);

  const validPassword = await bcrypt.compare(password, user.password); // TODO: Clarify variable names
  if (!validPassword) throw new Error('Invalid email or password.');

  return generateAuthToken(user);
}
