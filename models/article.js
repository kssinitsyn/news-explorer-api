const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'author',
  },
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (data) => validator.isURL(data),
      message: 'Неверный формат URL',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (data) => validator.isURL(data),
      message: 'Неверный формат URL',
    },
  },
});

module.exports = mongoose.model('article', articleSchema);
