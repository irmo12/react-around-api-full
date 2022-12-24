const router = require('express').Router();
const {
  getCards, createCard, likeCard, unlikeCard, deleteCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', unlikeCard);
router.delete('/:id', deleteCard);

module.exports = { cardsRoute: router };
