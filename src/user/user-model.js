const Joi = require('joi');
const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema);

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

module.exports = { validateNewUser, validateUser, User };
