const jwt = require('jsonwebtoken');
const Unathorized = require('../errors/unauthorized-err')

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unathorized('Authorization Required'))
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new Unathorized('Authorization Required'))
  }

  req.user = payload;

  next();
};