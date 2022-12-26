const router = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const auth = require('../middleware/auth')

const {
  getUser,
  getUserByCredentials,
  createUser,
  patchUser,
  patchUserAvatar,
} = require('../controllers/users')


router.get('/', auth, getUserByCredentials)
router.get('/me', auth, getUser)
router.patch('/me', auth, patchUser)
router.patch('/me/avatar', auth, patchUserAvatar)

module.exports = { usersRoute: router }
