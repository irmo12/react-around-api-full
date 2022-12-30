const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')
const { urlencoded } = require('express')
const { errors, celebrate, Joi } = require('celebrate')
const cors = require('cors')

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

app.use('/', router)
app.post('/signin', login)

app.post(
  '/signup',
  celebrate({
    headers: Joi.object().keys({
      'Content-Type': Joi.string().valid('application/json'),
    }),
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string(),
    }),
  }),
  createUser,
)

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' })
})

app.use(errors());
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
