'use strict';

const express = require(`express`);
const DEFAULT_PORT = 3000;

const offersRouter = require(`../routes/offers`);

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number(parseInt(customPort, 10)) || DEFAULT_PORT;
    const app = express();
    app.use(express.json());
    app.use(`/offers`, offersRouter);

    app.get(`/`, async (req, res) => {
      return res.send(`Hello, Api Service!`);
    });

    app.listen(port, () => console.log(`Server has been started at ${port}`));
  }
};
