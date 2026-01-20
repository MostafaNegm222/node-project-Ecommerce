const express = require("express")
const userController = require("../controllers/userControllers.js")
const auth = require("../middleware/auth.js")
const restrictTo = require("../middleware/restrictTo.js")
const router = express.Router()

router.route("/").get(auth,restrictTo("admin","user"),userController.getAllUsers)



module.exports = router