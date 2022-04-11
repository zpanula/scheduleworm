import express from 'express';
import cookieParser from 'cookie-parser';
import users from './routes/users.js';
import 'dotenv/config';
import connectMongoose from './config/database.js';

connectMongoose();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use('/user', users);

app.get('/', (req, res) => {
  res.render('pages/index');
});

const port = process.env.API_PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
