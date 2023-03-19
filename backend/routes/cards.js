const router = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const validateUrl = require('../middleware/validateincoming')
const auth = require('../middleware/auth')

const {
  getCards,
  createCard,
  likeCard,
  unlikeCard,
  deleteCard,
} = require('../controllers/cards')

router.get('/', auth, getCards)
router.post('/', auth, celebrate({body: Joi.string().required().custom(validateUrl)}), createCard)
router.put('/likes/:id', auth, likeCard)
router.delete('/likes/:id', auth, unlikeCard)
router.delete('/:id', auth, deleteCard)

module.exports = { cardsRoute: router }

