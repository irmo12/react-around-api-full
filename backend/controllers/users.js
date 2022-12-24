const User = require('../models/user')
const bcrypt = require('bcryptjs')
const {
  OK,
  SERVER_INTERNAL,
  BAD_REQ,
  CREATED,
  NOT_FOUND,
} = require('../utils/utils')

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(SERVER_INTERNAL).send({ message: 'Internal server error' })
    })
}

userSchema.statics.getUser = function getUser (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect email or password'));
          }

          return user;
        });
    });
};

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
  getUsers,
  createUser,
  patchUser,
  patchUserAvatar,
}
