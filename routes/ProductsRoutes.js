const express = require("express");
const productController = require("../controllers/ProductsControllers.js");
const auth = require("../middleware/auth.js")
const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(auth, productController.createProduct);

  router.route("/get-status").get(productController.getStatus)
  router.route("/deleted-items").get(productController.getDeletedItems)
  router.route("/user-products").get(auth,productController.getProductsForUser)
  
  router.route("/:id")
  .get(productController.getOneProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct)
  

module.exports = router;
