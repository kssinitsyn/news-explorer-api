// Переменные окружения
require('dotenv').config();

const { PORT, ADRESS_DB } = process.env;

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const mainRouter = require('./routes/index');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

mongoose.connect(ADRESS_DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(8),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(8),
    }),
  }),
  createUser,
);

app.use(auth);

app.use(mainRouter);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка при запросе на сервер' : message });
});


app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`);
});
