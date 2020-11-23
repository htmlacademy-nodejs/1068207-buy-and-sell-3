'use strict';

const {Router} = require(`express`);

const searchRouter = new Router();

searchRouter.get(`/`, (req, res) => {
  return res.render(`search-result`);
});

module.exports = searchRouter;
