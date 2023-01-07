const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {
  OK,
  SERVER_INTERNAL,
  BAD_REQ,
  CREATED,
  NOT_FOUND,
} = require('../utils/utils')
const BadReq = require('../errors/bad-req-err')
const Unauthorized = require('../errors/unauthorized-err')
const NotFound = require('../errors/not-found-err')

const getUser = (req, res) => {
  const { id } = req.body
  User.findById({ id })
    .then((user) =>
      res.send({ name: user.name, about: user.about, avatar: user.avatar }),
    )
    .catch(next)
}

const login = (req, res) => {
  const { email, password } = req.body
  return User.getUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Unauthorized')
      }
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', {
        expiresIn: '7d',
      })
      res.send({ token })
    })
    .catch(next)
}

const createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ email, password: hash, name, about, avatar })
    })
    .then((user) => {
      if (!user) {
        throw new BadReq('Invalid user information')
      }
      res.status(CREATED).send({ data: user })
    })
    .catch(next)
}

const patchUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadReq('Validation error, check data')
      } else if (err.name === 'DocumentNotFoundError') {
        throw new NotFound('no such user')
      }
    })
    .catch(next)
}

const patchUserAvatar = (req, res) => {
  const { avatar } = req.body
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadReq('bad link')
      } else if (err.name === 'DocumentNotFoundError') {
        throw new NotFound('no such user')
      }
    })
    .catch(next)
}

module.exports = {
  getUser,
  createUser,
  patchUser,
  patchUserAvatar,
  login,
}
