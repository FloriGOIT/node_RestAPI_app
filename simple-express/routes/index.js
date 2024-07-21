const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Simple express app' })
})

router.post('/login', (req, res, next) => {
  const { email, password } = req.body
  res.render('response', { title: 'Simple express app', email, password })
})

module.exports = router