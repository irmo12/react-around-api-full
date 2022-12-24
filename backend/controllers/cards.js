const Card = require('../models/card');
const {
  OK, SERVER_INTERNAL, BAD_REQ, CREATED, NOT_FOUND,
} = require('../utils/utils');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(SERVER_INTERNAL).send({ message: 'Internal server error' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQ).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      } else {
        res.status(SERVER_INTERNAL).send({ message: 'Internal server error' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'no such card' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'cast error, check body' });
      } else {
        res.status(SERVER_INTERNAL).send({ message: 'failed to like card' });
      }
    });
};

const unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'no such card' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'cast error, check body' });
      } else {
        res.status(SERVER_INTERNAL).send({ message: 'failed to unlike card' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({
          message: 'No card found with that id',
        });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'cast error, check body' });
      } else {
        res.status(SERVER_INTERNAL).send({ message: 'Internal server error' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  likeCard,
  unlikeCard,
  deleteCard,
};
