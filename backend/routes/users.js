const router = require('express').Router()
const auth = require('../middleware/auth')
const validateUrl = require('../middleware/validateIncoming')
const { celebrate, Joi } = require('celebrate')


const {
  getUser,
  patchUser,
  patchUserAvatar,
} = require('../controllers/users')


router.get('/me', auth, getUser)
router.patch('/me', auth, patchUser)
router.patch('/me/avatar', auth, celebrate({body: Joi.string().required().custom(validateUrl)}),  patchUserAvatar)

module.exports = { usersRoute: router }
