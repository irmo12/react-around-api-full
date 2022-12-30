const router = require('express').Router()
const auth = require('../middleware/auth')

const {
  getUser,
  login,
  patchUser,
  patchUserAvatar,
} = require('../controllers/users')

router.get('/', auth, login)
router.get('/me', auth, getUser)
router.patch('/me', auth, patchUser)
router.patch('/me/avatar', auth, patchUserAvatar)

module.exports = { usersRoute: router }
