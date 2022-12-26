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

const getUser = (req, res) => {
  const {id} = req.body
  User.findById({id})
    .then((user) => res.send({ name: user.name, about: user.about, avatar: user.avatar }))
    .catch(() => {
      res.status(SERVER_INTERNAL).send({ message: 'Internal server error' })
    })
}

const login = (req, res) => {
  const { email, password } = req.body
  return User.getUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', {
        expiresIn: '7d',
      })
      res.send({ token })
    })
    .catch((err) => {
      res.status(401).send({ message: err.message })
    })
}

const createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ email, password: hash, name, about, avatar })
    })
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQ).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        })
      } else {
        res.status(SERVER_INTERNAL).send({ message: 'Internal server error' })
      }
    })
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
        res.status(BAD_REQ).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        })
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send({ message: 'no such user' })
      } else {
        res.status(SERVER_INTERNAL).send({ message: "couldn't update profile" })
      }
    })
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
        res.status(BAD_REQ).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        })
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND).send('no such user')
      } else {
        res.status(SERVER_INTERNAL).send({ message: "couldn't update picture" })
      }
    })
}

module.exports = {
  getUser,
  createUser,
  patchUser,
  patchUserAvatar,
  login
}
