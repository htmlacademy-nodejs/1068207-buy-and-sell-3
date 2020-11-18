'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const http = require(`http`);
const PORT = 3000;
const MOCK_FILE = `mocks.json`;
const {HttpCode} = require(`../utils/_constants`);

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const handleClientConnect = async (req, res) => {
  let plainHtml;

  res.writeHead(HttpCode.OK, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  switch (req.url) {
    case `/`:
      try {
        const rawOffers = await fs.readFile(MOCK_FILE);

        const offerList = JSON.parse(rawOffers)
          .map((offer) => `<li>${offer.title}</li>`)
          .join(` `);

        return sendResponse(res, HttpCode.OK, offerList);

      } catch (error) {
        console.error(chalk.red(error));
        return sendResponse(res, HttpCode.NOT_FOUND, `Not Found`);
      }

    default: return res.end(`Упс, такой страницы нет, 404`);
  }

};

const handleServerConnect = async (error, port) => {
  if (error) {
    return console.error(chalk.red(`Ошибка при создании сервера, ${error}`));
  }

  return console.info(chalk.green(`Ожидаю соединений на ${port}`));
};

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number(parseInt(customPort, 10)) || PORT;

    http.createServer(handleClientConnect)
      .listen(port)
      .on(`listening`, (error) => handleServerConnect(error, port));
  }
};
