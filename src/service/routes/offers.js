'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);

const MOCK_FILE = `mocks.json`;
const {HttpCode} = require(`../utils/_constants`);

const offersRouter = new Router();

offersRouter.get(`/`, async (req, res) => {
  try {
    const result = await fs.readFile(MOCK_FILE);
    return res.json(JSON.parse(result));
  } catch (error) {
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`[]`);
  }
});

module.exports = offersRouter;
