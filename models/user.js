const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Error400 = require('../errors/400');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (data) => validator.isEmail(data),
      message: 'Неверный формат email',
    },

  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,

  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error400('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error400('Неправильные почта или пароль'));
          }
          return user;
        });
    })
    .catch(next);
};

module.exports = mongoose.model('user', userSchema);
