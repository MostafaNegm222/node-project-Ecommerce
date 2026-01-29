const express = require("express");
const userController = require("../controllers/userControllers.js");
const auth = require("../middleware/auth.js");
const restrictTo = require("../middleware/restrictTo.js");
const router = express.Router();

router
  .route("/")
  .get(auth, restrictTo("admin"), userController.getAllUsers)
  .post(auth, restrictTo("admin"), userController.createUser);

router
  .route("/:id")
  .get(auth, restrictTo("admin"), userController.getOneUser)
  .patch(auth, restrictTo("admin"), userController.deleteUser)
  .delete(auth, restrictTo("admin"), userController.deleteUserPermanently);

router
  .route("/edit/:id")
  .patch(auth, restrictTo("admin"), userController.updateUserRole)

router
  .route("/role/:id")
  .patch(auth, restrictTo("admin"), userController.updateUserRole)

module.exports = router;
