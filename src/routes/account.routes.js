const express = require('express')
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controllers")


const router = express.Router()

// post api/account
//  cokkies
// create a new account

// router.post("/", authMiddleware.authMiddleware, accountController.accountController)
router.post("/", authMiddleware.authMiddleware, accountController.accountController)





module.exports = router