const express = require("express");
const { body, check } = require("express-validator");

const productsController = require("../controllers/products");
const fileUpload = require("../middleware/fileUrl");

const router = express.Router();

router.get("/api/products", productsController.getAllProducts);

router.post(
  "/api/product",
  fileUpload.single("pImage"),
  [
    body("pName", "product name should be between 3 to 60 character.")
      .trim()
      .isString()
      .isLength({ min: 3, max: 60 }),
    body("pPrice", "product price should be between 10 to 2000 tk.").isFloat({
      min: 10,
      max: 200,
    }),
  ],
  productsController.addProduct
);

router.patch(
  "/api/product/:pId",
  fileUpload.single("pImage"),
  [
    body("pName", "product name should be between 3 to 60 character.")
      .trim()
      .isString()
      .isLength({ min: 3, max: 60 }),
    body("pPrice", "product price should be between 10 to 2000 tk.").isFloat({
      min: 10,
      max: 200,
    }),
  ],
  productsController.updateProduct
);

router.delete("/api/product/:pId", productsController.deleteProduct);

module.exports = router;
