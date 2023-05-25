const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const verifyToken = require('../middlewares/verifyToken')

router.post('/register', authController.register)

router.post('/login', authController.login)

router.post('/logout', verifyToken, authController.logout)

module.exports = router