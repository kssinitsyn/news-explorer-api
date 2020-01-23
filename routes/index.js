const mainRouter = require('express').Router();

const usersRouter = require('./users');
const articlesRouter = require('./articles');

mainRouter.use('/users', usersRouter);
mainRouter.use('/articles', articlesRouter);

module.exports = mainRouter;
