const jwt = require('jsonwebtoken');
require('dotenv/config');

function authorize(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const data = jwt.verify(token, process.env.API_SECRET_KEY);
    req.email = data.email;
    return next();
  } catch (ex) {
    return res.status(400).send('Invalid token.');
  }
}

module.exports = authorize;
