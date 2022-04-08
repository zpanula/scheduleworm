import mongoose from 'mongoose';

const { MONGO_URI } = process.env;

export function connect() {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.log('Database connection failed.');
      console.error(error);
      process.exit(1);
    });
}
