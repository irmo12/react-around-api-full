const mongoose = require('mongoose')
const validator = require('validator')

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
    minlength: 8,
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

userSchema.statics.getUser = function getUser(email, password) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject(new Error('Incorrect email or password'))
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Incorrect email or password'))
      }

      return user
    })
  })
}

module.exports = mongoose.model('User', userSchema)
