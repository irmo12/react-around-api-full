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
      name: Joi.string(),
      link: Joi.string().required().custom(validateURL),
    }).unknown(true),
  }),
  createCard,
)
router.put('/likes/:id', auth, likeCard)
router.delete('/likes/:id', auth, unlikeCard)
router.delete('/:id', auth, deleteCard)

module.exports = { cardsRoute: router }
