const Card = require('../models/card')
const { OK, CREATED } = require('../utils/utils')
const badReq = require('../errors/bad-req-err')
const NotFound = require('../errors/not-found-err')

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {conole.log('1',cards);res.send({ data: cards })})
    .catch(next)
}

const createCard = (req, res) => {
  const { name, link } = req.body
  const owner = req.user._id
  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new badReq('Invalid card information')
      }
      res.status(CREATED).send({ data: card })
    })
    .catch(next)
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFound('no such card')
      } else if (err.name === 'CastError') {
        throw new badReq('cast error, check body')
      }
    })
    .catch(next)
}

const unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFound('no such card')
      } else if (err.name === 'CastError') {
        throw new badReq('cast error, check body')
      }
    })
    .catch(next)
}

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFound('No card found with that id')
      } else if (err.name === 'CastError') {
        throw new badReq('cast error, check body')
      }
    })
    .catch(next)
}

module.exports = {
  getCards,
  createCard,
  likeCard,
  unlikeCard,
  deleteCard,
}
