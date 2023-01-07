const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, likeCard, unlikeCard, deleteCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  headers:  Joi.object().keys({'authorization': Joi.string(),
  "Content-Type": Joi.string().valid("application/json")})
}), createCard);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', unlikeCard);
router.delete('/:id', deleteCard);

module.exports = { cardsRoute: router };
