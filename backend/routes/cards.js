const router = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const auth = require('../middleware/auth')
const {
  getCards,
  createCard,
  likeCard,
  unlikeCard,
  deleteCard,
} = require('../controllers/cards')

router.get('/', auth, getCards)
router.post('/', auth, createCard)
router.put('/likes/:id', auth, likeCard)
router.delete('/likes/:id', auth, unlikeCard)
router.delete('/:id', auth, deleteCard)

module.exports = { cardsRoute: router }

/*celebrate({
  headers:  Joi.object().keys({'authorization': Joi.string(),
  "Content-Type": Joi.string().valid("application/json")})*/
