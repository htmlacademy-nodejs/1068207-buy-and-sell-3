'use strict';

const {Router} = require(`express`);

const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => {
  return res.send(`Current route is /offers/category/${req.params.id}`);
});

offersRouter.get(`/add`, (req, res) => {
  return res.send(`Current route is /offers/add`);
});

offersRouter.get(`/:id`, (req, res) => {
  return res.send(`Current route is /offers/${req.params.id}`);
});

offersRouter.get(`/edit/:id`, (req, res) => {
  return res.send(`Current route is /offers/edit/${req.params.id}`);
});

module.exports = offersRouter;
