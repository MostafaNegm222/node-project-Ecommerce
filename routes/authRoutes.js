const express = require("express")
const authController = require("../controllers/authController.js")
const validator = require("../middleware/validator.js")
const registerSchema = require("../validators/register.js")
const loginSchema = require("../validators/login.js")
const router = express.Router()


router.route("/signup").post(validator(registerSchema),authController.signup)
router.route("/login").post(validator(loginSchema),authController.login)

module.exports = router