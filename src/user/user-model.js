import Joi from 'joi';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
});

export const User = mongoose.model('User', userSchema);

// TODO: Improve the naming or separation of this validation.

function validateNewUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(user);
}

export { validateNewUser, validateUser };
