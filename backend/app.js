require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')
const { urlencoded } = require('express')
const { errors, celebrate, Joi } = require('celebrate')
var cors = require('cors')
const { requestLogger, errorLogger } = require('./middleware/logger');
const { login, createUser } = require('./controllers/users')
const router = require('./routes')


mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
})

const { PORT = 3000 } = process.env

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)
app.use(cors())
app.options('*', cors())
app.use(bodyParser.json())
app.use(urlencoded({ extended: true }))
app.use(requestLogger)
app.use('/', router)

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signin', login)

app.post(
  '/signup',
  celebrate({
    headers: Joi.object()
      .keys({
        'Content-Type': Joi.string().valid('application/json'),
      })
      .options({ allowUnknown: true }),
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string(),
    }),
  }),
  createUser,
)

app.use(errorLogger)

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' })
})

app.use(errors())
app.use((err, req, res, next) => {
  err.statusCode ||= 500
  res.status(err.statusCode).send({
    message:
      err.statusCode === 500 ? 'An error occurred on the server' : err.message,
  })
})

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`)
})
