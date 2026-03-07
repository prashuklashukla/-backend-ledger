const express = require("express")
const authController = require('../controllers/auth.controller')

const router = express.Router()


/* POST /api/auth/register */
router.post("/register", authController.controllerAuthRegister)


/* POST /api/auth/login */
router.post("/login", authController.controllerAuthLogin)

/**
 * - POST /api/auth/logout
 */
router.post("/logout", (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
})



module.exports = router