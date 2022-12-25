const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser,
  getUsers,
  createUser,
  patchUser,
  patchUserAvatar,
} = require('../controllers/users');

// router.get('/', getUsers);

router.get('/', auth, getUser);
router.post('/signup', celebrate({
  headers: Joi.object().keys({
    'Content-Type': Joi.string().valid('application/json'),
  }),
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string()
  }),
}), createUser);
router.patch('/me', patchUser);
router.patch('/me/avatar', patchUserAvatar);

module.exports = { usersRoute: router };
