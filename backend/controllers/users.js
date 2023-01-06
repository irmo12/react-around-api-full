const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { OK, CREATED } = require('../utils/utils')
const BadReq = require('../errors/bad-req-err')
const Unauthorized = require('../errors/unauthorized-err')
const NotFound = require('../errors/not-found-err')

const getUser = (req, res) => {
  const { id } = req.body
  User.findById({ id })
    .orFail(new NotFound('no user by that id'))
    .then((user) =>
      res.send({ name: user.name, about: user.about, avatar: user.avatar }),
    )
    .catch(next)
}

const login = (req, res) => {
  const { email, password } = req.body
  return User.getUserByCredentials(email, password)
    .then((user) => {
      if (!res.length) {
        throw new Unauthorized('Unauthorized')
      }
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', {
        expiresIn: '7d',
      })
      res.send({ token })
    })
    .catch(next)
}

const createUser = (req, res, next) => {
  let { email, password, name, about, avatar } = req.body
  bcrypt
    .hash(password, 10)
    .catch(next)
    .then((hash) => User.create({ email, password: hash, name, about, avatar }))
    .then((user) => {
      ;({ email, name, about, avatar } = user)
      res.status(CREATED).send({ data: { email, name, about, avatar } })
    })
    .catch((err) => {
      console.log(err.code)
      if (err.name === 'ValidationError') {
        return next(
          new BadReq(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(', ')}`,
          ),
        )
      }
      if (err.code === 11000) {
        throw new BadReq('A user with that email is already registered')
      }
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
