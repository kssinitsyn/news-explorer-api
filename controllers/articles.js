const Article = require('../models/article');

const Error400 = require('../errors/400');
const Error404 = require('../errors/404');
const Error403 = require('../errors/403');

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  const owner = req.user;

  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => {
      if (!article) {
        throw new Error400('Ошибка при создании статьи');
      }
      return res.status(201).send({
        title: article.title,
        text: article.text,
        date: article.date,
        source: article.source,
        link: article.link,
        image: article.image,
        author: article.owner,
      });
    })
    .catch(() => next(new Error400('Ошибка при создании статьи')));
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .then((article) => {
      if (!article) {
        throw new Error404('Статья не найдена');
      }
      if (JSON.stringify(article.owner) !== JSON.stringify(req.user)) {
        throw new Error403('Статья принадлежит другому автору');
      }
      Article.deleteOne(article)
        .then(() => {
          res.status(200).send({ message: 'Статья успешно удалена!' });
        })
        .catch((err) => {
          throw new Error400(err);
        });
    })
    .catch(() => next(new Error400('Статья не найдена')));
};

const getAllArticles = (req, res, next) => {
  const owner = req.user;

  Article.find({ owner })
    .then((article) => {
      if (article.length === 0) {
        throw new Error404('У вас нет добавленных статей');
      }
      return res.status(200).send({ data: article });
    })
    .catch(next);
};

module.exports = {
  getAllArticles,
  createArticle,
  deleteArticle,
};
