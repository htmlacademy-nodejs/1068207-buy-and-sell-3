'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../utils/_constants`);

const searchRouter = new Router();


// поиск объявлений по заголовку
searchRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;
  const mocks = req.app.get(`mocks`);

  if (!query || !query.length) {
    return res.status(HttpCode.BAD_REQUEST).send(`Что-то пошло не так`);
  }

  const result = mocks.filter((offer) => offer.title.includes(query));

  return res.send(JSON.stringify(result));
});

module.exports = searchRouter;
