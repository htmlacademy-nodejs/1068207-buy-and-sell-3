'use strict';

const express = require(`express`);
const loginRouter = require(`./routes/login`);
const myRouter = require(`./routes/my`);
const offersRouter = require(`./routes/offers`);
const registerRouter = require(`./routes/register`);
const searchRouter = require(`./routes/search`);

const DEFAULT_PORT = `8000`;

const app = express();
app.use(`/register`, registerRouter);
app.use(`/login`, loginRouter);
app.use(`/my`, myRouter);
app.use(`/offers`, offersRouter);
app.use(`/search`, searchRouter);

app.get(`/`, (req, res) => {
  return res.send(`Current route is /`);
});

app.listen(DEFAULT_PORT, () => console.log(`Server has been started at ${DEFAULT_PORT}`));
