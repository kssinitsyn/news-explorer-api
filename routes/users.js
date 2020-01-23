const users = require('express').Router();
const { getAllUsers, findUser } = require('../controllers/users');

users.get('/', getAllUsers);
users.get('/me/', findUser);

module.exports = users;
