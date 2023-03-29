const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { NODE_ENV, JWT_SECRET } = process.env;
const { OK, CREATED } = require('../utils/utils')
const BadReq = require('../errors/bad-req-err')
const Unauthorized = require('../errors/unauthorized-err')
const NotFound = require('../errors/not-found-err')

const getUser = (req, res, next) => {
  const { _id } = req.user
  User.findById({ _id })
    .orFail(new NotFound('no user by that id'))
    .then((user) => { res.send(({ id, email, name, about, avatar } = user)) })
    .catch(next)
}

const login = (req, res, next) => {
  const { email, password } = req.body
  User.getUserByCredentials(email, password)
    .then((userP) => {
      if (typeof userP === "string") {
        return next(new Unauthorized('Unauthorized'))
      }
      if (typeof userP === "object") {
      const token = jwt.sign(
        { _id: userP._id },
        NODE_ENV ==='production' ? JWT_SECRET: 'secret' , {
        expiresIn: '7d',
      })
      res.status(OK).send({ token })}
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

const patchUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK).send( user ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadReq('Validation error, check data')
      } else if (err.name === 'DocumentNotFoundError') {
        throw new NotFound('no such user')
      }
    })
    .catch(next)
}

const patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK).send(user))
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
