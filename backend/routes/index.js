const router = require('express').Router();

const { usersRoute } = require('./users');
const { cardsRoute } = require('./cards');

router.use('/users', usersRoute);
router.use('/cards', cardsRoute);

module.exports = router;
