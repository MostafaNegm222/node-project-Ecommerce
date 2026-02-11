const express = require("express");
const productController = require("../controllers/ProductsControllers.js");
const auth = require("../middleware/auth.js");
const restrictTo = require("../middleware/restrictTo.js");
const { upload } = require("../middleware/multer.js");


const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(auth,restrictTo("admin"),upload.single("image"), productController.createProduct);

  router.route("/get-status").get(productController.getStatus)
  router.route("/deleted-items").get(auth,restrictTo("admin"),productController.getDeletedItems)
  router.route("/user-products").get(auth,productController.getProductsForUser)
  
  router.route("/:id")
  .get(auth,productController.getOneProduct)
  .patch(auth,restrictTo("admin"),productController.deleteProduct)
  .delete(auth,restrictTo("admin"),productController.deleteProductPermanently)

  router.route("/edit/:id")
  .patch(auth,restrictTo("admin"),productController.updateProduct)
  
module.exports = router;
