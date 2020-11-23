'use strict';

const {Router} = require(`express`);

const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => {
  return res.render(`category`);
});

offersRouter.get(`/add`, (req, res) => {
  return res.render(`new-ticket`);
});

offersRouter.get(`/:id`, (req, res) => {
  return res.render(`ticket`);
});

offersRouter.get(`/edit/:id`, (req, res) => {
  return res.render(`ticket-edit`);
});

module.exports = offersRouter;
