'use strict';

const express = require(`express`);
const fs = require(`fs`).promises;
const {
  MockFilenames: {
    FILE_CATEGORIES_PATH,
    FILE_TITLES_PATH,
    FILE_SENTENCES_PATH,
    FILE_COMMENTS_PATH
  }
} = require(`../utils/_constants`);
const {readContent} = require(`../utils/_utils`);

const DEFAULT_PORT = 3000;

const offersRouter = require(`../routes/api/offers`);
const categoriesRouter = require(`../routes/api/categories`);
const searchRouter = require(`../routes/api/search`);

const getCurrentAppState = async () => {
  try {
    const result = await fs.readFile(`mocks.json`);
    return JSON.parse(result);
  } catch (error) {
    return [];
  }
};

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number(parseInt(customPort, 10)) || DEFAULT_PORT;
    const app = express();
    app.set(`mocks`, await getCurrentAppState());
    app.set(`categories`, await readContent(`./data/categories.txt`));
    app.set(`titles`, await readContent(`./data/titles.txt`));
    app.set(`sentences`, await readContent(`./data/sentences.txt`));
    app.set(`comments`, await readContent(`./data/comments.txt`));
    app.use(express.json());
    app.use(`/api`, offersRouter);
    app.use(`/api`, categoriesRouter);
    app.use(`/api`, searchRouter);

    app.get(`/`, async (req, res) => {
      return res.send(`Hello, Api Service!`);
    });

    app
      .listen(port, () => console.log(`Server has been started at ${port}`))
      .on(`error`, (error) => console.log(error));
  }
};
