import mongoose from 'mongoose';
import logger from './logger.js';

const { MONGO_URI } = process.env;

export default function connectMongoose() {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      logger.info('Connected to MongoDB');
    })
    .catch((error) => {
      logger.error(error);
      process.exit(1);
    });
}
