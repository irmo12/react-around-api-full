const Card = require('../models/card')
const { OK, CREATED } = require('../utils/utils')
const badReq = require('../errors/bad-req-err')
const NotFound = require('../errors/not-found-err')
const unauthorized = require('../errors/unauthorized-err')
const { Console } = require('winston/lib/winston/transports')

const getCards = (req, res, next) => {
  Card.find({})
    .orFail()
    .then((cards) => {
      res.send(cards)
    })
    .catch(next)
}

const createCard = (req, res, next) => {
  const { name, link } = req.body
  const owner = req.user._id
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'validationError') {
        next(new badReq('Invalid card information'))
      } else {
        next(err)
      }
    })
}

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('no such card'))
      } else if (err.name === 'CastError') {
        next(new badReq('cast error, check body'))
      } else {
        next(err)
      }
    })
}

const unlikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('no such card'))
      } else if (err.name === 'CastError') {
        next(new badReq('cast error, check body'))
      } else {
        next(err)
      }
    })
}

const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail()
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new unauthorized('only the card owner may delete it'))
      }
      return card.deleteOne().then(() => res.send(card))
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFound('No card found with that id'))
      } else if (err.name === 'CastError') {
        return next(new badReq('cast error, check body'))
      } else next(err)
    })
}

module.exports = {
  getCards,
  createCard,
  likeCard,
  unlikeCard,
  deleteCard,
}
