import Joi from 'joi';
import mongoose from 'mongoose';

export const User = mongoose.model(
  'User',
  new mongoose.Schema({
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
    isAdmin: {
      type: Boolean,
      default: true, // TODO: Change this to false
    },
  })
);

const userSchema = Joi.object({
  email: Joi.string().min(5).max(255).required().email(),
  isAdmin: Joi.boolean(),
});

const newUserSchema = Joi.object({
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(255).required(),
  isAdmin: Joi.boolean(),
});

export { newUserSchema, userSchema };
