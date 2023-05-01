const router = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const auth = require('../middleware/auth')
const validateURL = require('../middleware/validateURL')

const {
  getCards,
  createCard,
  likeCard,
  unlikeCard,
  deleteCard,
} = require('../controllers/cards')

router.get('/', auth, getCards)
router.post(
  '/',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().required().custom(validateURL),
    }),
  }),
  createCard,
)
router.put(
  '/likes/:id',
  auth,
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  likeCard,
)

router.delete(
  '/likes/:id',
  auth,
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  unlikeCard,
)

router.delete(
  '/:id',
  auth,
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCard,
)

module.exports = { cardsRoute: router }
