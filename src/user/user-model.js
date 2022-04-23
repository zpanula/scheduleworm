import Joi from 'joi';
import bcrypt from 'bcrypt';
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import logger from '../config/logger.js';

class User extends Model {}

export default User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    hooks: {
      beforeCreate: async (user) => {
        const hashedPassword = await bcrypt.hash(
          user.password,
          bcrypt.genSaltSync(8)
        );
        // eslint-disable-next-line no-param-reassign
        user.password = hashedPassword;
      },
    },
  }
);

try {
  await User.sync();
  logger.debug('User table (re)created.');
} catch (err) {
  logger.error('User table (re)creation failed.', err);
}

export const userSchema = Joi.object({
  username: Joi.string().min(3).max(25).required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().min(3).max(25).required(),
  password: Joi.string().min(5).max(255).required(),
});

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(25).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(255).required(),
  isAdmin: Joi.boolean(),
});
