const articles = require('express').Router();
const { createArticle, getAllArticles, deleteArticle } = require('../controllers/articles');

articles.get('/', getAllArticles);
articles.post('/', createArticle);
articles.delete('/:id', deleteArticle);

module.exports = articles;
