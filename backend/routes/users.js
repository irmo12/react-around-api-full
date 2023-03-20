const router = require('express').Router()
const auth = require('../middleware/auth')
const { celebrate, Joi } = require('celebrate')
const validateURL = require('../middleware/validateURL')

const { getUser, patchUser, patchUserAvatar } = require('../controllers/users')

router.get('/me', auth, getUser)
router.patch('/me', auth, patchUser)
router.patch(
  '/me/avatar',
  auth,
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateURL)
    }).unknown(true),
  }),
  patchUserAvatar,
)

module.exports = { usersRoute: router }
