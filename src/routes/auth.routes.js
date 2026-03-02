const express = require('express')
const authController = require('../controllers/auth.controlle')

const router = express.Router()


//  post =>  /api/auth/register
router.post('/register', authController.controllerAuthRegister)


// post => /api/auth/login
router.post('/login', authController.controllerAuthLogin)



module.exports = router