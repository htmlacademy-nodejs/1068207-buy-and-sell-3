'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {generateOffer, readContent} = require(`../utils/_utils`);
const {
  ExitCode,
  MockFilenames: {
    FILE_CATEGORIES_PATH,
    FILE_TITLES_PATH,
    FILE_SENTENCES_PATH,
    FILE_COMMENTS_PATH
  }
} = require(`../utils/_constants`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;


const generateOffers = (count, categories, titles, sentences, comments) => {
  return Array(count).fill({}).map(() => generateOffer(titles, categories, sentences, comments));
};


module.exports = {
  name: `--generate`,
  async run(args) {
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer, categories, titles, sentences, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      return console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file. Error: ${err}`));
      return process.exit(ExitCode.error);
    }
  }
};
