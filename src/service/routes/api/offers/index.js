'use strict';

const {body, validationResult} = require(`express-validator`);
const {Router} = require(`express`);
const {nanoid} = require(`nanoid`);
const {HttpCode} = require(`../../../utils/_constants`);

const offersRouter = new Router();

// возвращает список объявлений;
offersRouter.get(`/offers`, async (req, res) => {
  const mocks = req.app.get(`mocks`);

  if (!Array.isArray(mocks) && mocks.length !== 0) {
    return res.status(HttpCode.NOT_FOUND).send([]);
  }

  return res.send(JSON.stringify(mocks));
});


// возвращает полную информацию определённого объявления;
offersRouter.get(`/offers/:offerId`, async (req, res) => {
  const {offerId} = req.params;
  const mocks = req.app.get(`mocks`);

  const findedOffer = mocks.find((offer) => offer.id === offerId);

  if (!findedOffer) {
    return res.status(HttpCode.NOT_FOUND).send({});
  }

  return res.send(JSON.stringify(findedOffer));
});

// возвращает список комментариев определённого объявления;
offersRouter.get(`/offers/:offerId/comments`, async (req, res) => {
  const {offerId} = req.params;
  const mocks = req.app.get(`mocks`);

  const findedOffer = mocks.find((offer) => offer.id === offerId);

  if (!findedOffer) {
    return res.status(HttpCode.NOT_FOUND).send({});
  }

  const comments = findedOffer.comments ? findedOffer.comments : [];

  return res.send(JSON.stringify(comments));
});

// создаёт новое объявление
offersRouter.post(`/offers`,
    [
      body(`title`).isLength({min: 5}),
      body(`description`).isLength({min: 5}),
      body(`categories`).isArray().isLength({min: 1}),
      body(`sum`).isLength({min: 1}),
      body(`picture`).isLength({min: 1}),
      body(`type`).isLength({min: 1})
    ],
    async (req, res) => {
      const mocks = req.app.get(`mocks`);
      const {title, categories, description, sum, type, picture} = req.body;
      const errors = validationResult(req);


      if (!errors.isEmpty()) {
        return res.status(HttpCode.BAD_REQUEST).send(`Что-то пошло не так, проверьте правильность заполнения полей.`);
      }

      const newOffer = {
        id: nanoid(),
        title,
        categories,
        description,
        sum,
        type,
        picture
      };

      req.app.set(`mocks`, [...mocks, newOffer]);

      return res.send(JSON.stringify(newOffer));
    });


// создаёт новый комментарий;
offersRouter.post(`/offers/:offerId/comments`, async (req, res) => {
  const {offerId} = req.params;
  const {text} = req.body;
  const mocks = req.app.get(`mocks`);

  const findedOffer = mocks.findIndex((offer) => offer.id === offerId);

  if (findedOffer === -1) {
    return res.status(HttpCode.BAD_REQUEST).send(`Что-то пошло не так, попробуйте позже`);
  }

  if (!text || !text.trim().length) {
    return res.status(HttpCode.BAD_REQUEST).send(`Что-то пошло не так, проверьте правильность заполнения полей.`);
  }

  const newComment = {
    id: nanoid(),
    text
  };

  mocks[findedOffer].comments.push(newComment);


  return res.send(`Создан комментарий у записи ${offerId}`);
});

// TODO: валидация newData
// редактирует определённое объявление
offersRouter.put(`/offers/:offerId`, async (req, res) => {
  const {offerId} = req.params;
  const newData = req.body;
  const mocks = req.app.get(`mocks`);

  const findedOffer = mocks.findIndex((offer) => offer.id === offerId);

  if (findedOffer === -1) {
    return res.status(HttpCode.BAD_REQUEST).send(`Что-то пошло не так, попробуйте позже`);
  }

  const updatedOffer = {
    ...mocks[findedOffer],
    ...newData
  };

  mocks[findedOffer] = updatedOffer;

  req.app.set(`mocks`, mocks);

  return res.send(updatedOffer);
});


// удаление объявления
offersRouter.delete(`/offers/:offerId`, async (req, res) => {
  const {offerId} = req.params;
  const mocks = req.app.get(`mocks`);

  const findedOffer = mocks.findIndex((offer) => offer.id === offerId);

  if (findedOffer === -1) {
    return res.status(HttpCode.BAD_REQUEST).send(`Что-то пошло не так, попробуйте позже`);
  }

  const newData = mocks.filter((mock) => mock.id !== offerId);

  req.app.set(`mocks`, newData);

  return res.send(`Объявление ${offerId} удалено`);
});

// удаляет из определённой публикации комментарий с идентификатором
offersRouter.delete(`/offers/:offerId/comments/:commentId`, async (req, res) => {
  const {offerId, commentId} = req.params;
  const mocks = req.app.get(`mocks`);

  const findedOffer = mocks.findIndex((offer) => offer.id === offerId);

  if (findedOffer === -1) {
    return res.status(HttpCode.BAD_REQUEST).send(`Что-то пошло не так, попробуйте позже`);
  }

  const findedComment = mocks[findedOffer].comments.findIndex((comment) => comment.id === commentId);

  if (findedComment === -1) {
    return res.status(HttpCode.BAD_REQUEST).send(`Комментария с id: ${commentId} не существует`);
  }

  const updatedOffer = {
    ...mocks[findedOffer],
    comments: mocks[findedOffer].comments.filter((comment) => comment.id !== commentId)
  };

  mocks[findedOffer] = updatedOffer;

  req.app.set(`mocks`, mocks);

  return res.send(`Комментарий ${commentId} удален`);
});


module.exports = offersRouter;
