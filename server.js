import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import { connect } from './config/database.js';

const connection = connect();
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
