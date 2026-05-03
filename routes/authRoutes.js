const express = require("express")
const authController = require("../controllers/authController.js")
const validator = require("../middleware/validator.js")
const registerSchema = require("../validators/register.js")
const loginSchema = require("../validators/login.js")
const router = express.Router()


router.route("/signup").post(validator(registerSchema),authController.signup)
router.route("/login").post(validator(loginSchema),authController.login)
router.route("/profile/:id").get(authController.getProfile)
router.route("/confirm-email").post(authController.confirmEmail)
router.route("/forget-password").post(authController.forgetPassword)
router.route("/reset-password").post(authController.resetPassword)

module.exports = router