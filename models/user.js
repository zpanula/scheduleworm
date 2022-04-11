import jwt from 'jsonwebtoken';
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

userSchema.methods.generateAuthToken = function generateAuthToken() {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.API_SECRET_KEY
  );
  return token;
};

export const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

export { validateUser as validate };
