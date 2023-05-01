const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const badReq = require('../errors/bad-req-err')
const Unauthorized = require('../errors/unauthorized-err')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(mail) {
        return validator.isEmail(mail)
      },
      message: 'must be a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
    validate: {
      validator(link) {
        return validator.isURL(link)
      },
      message: 'must be a link',
    },
  },
})

userSchema.statics.getUserByCredentials = async function getUserByCredentials(
  email,
  password,
) {
  const user = await this.findOne({ email }).select('+password')
  if (!user) {
    throw new Unauthorized('Wrong email or password')
  }
  const matched = await bcrypt.compare(password, user.password)
  if (matched) {
    return user
  }
  throw new Unauthorized('Wrong email or password')
}

module.exports = mongoose.model('User', userSchema)
