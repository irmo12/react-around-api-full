const router = require('express').Router()
const auth = require('../middleware/auth')
const validIncoming = require('../middleware/validateIncoming')

const {
  getUser,
  patchUser,
  patchUserAvatar,
} = require('../controllers/users')


router.get('/me', auth, getUser)
router.patch('/me', auth, patchUser)
router.patch('/me/avatar', auth,  patchUserAvatar)

module.exports = { usersRoute: router }
