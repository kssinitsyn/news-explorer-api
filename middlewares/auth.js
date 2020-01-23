require('dotenv').config();
const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');

const Error400 = require('../errors/400');


const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new Error400('Необходимо авторизироваться');
  }
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key');
  } catch (err) {
    throw new Error400('Необходимо авторизироваться');
  }
  req.user = payload._id;
  next();
};

module.exports = auth;
