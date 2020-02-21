const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const Error404 = require('../errors/404');
const Error400 = require('../errors/400');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      if (!user) {
        throw new Error400('Ошибка при создании нового пользователя');
      } else {
        return res.status(201).send({
          _id: user._id, name: user.name, email: user.email,
        });
      }
    })
    .catch(() => next(new Error400('Ошибка при создании нового пользователя')));
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key',
        { expiresIn: '7d' },
      );
      res
        .status(200)
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: `Добро пожаловать, ${user.name} (${user._id})!` });
    })
    .catch(next);
};

const findUser = (req, res, next) => {
  const userId = jwt.verify(req.cookies.jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key');

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.status(200).send({ email: user.email, name: user.name });
      }
    })
    .catch(() => next(new Error404('Пользователь не найден!')));
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports = {
  getAllUsers,
  createUser,
  findUser,
  login,
};
