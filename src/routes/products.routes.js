const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct
} = require("../controllers/products.controller");

router.get("/", getAllProducts);

router.get("/:pid", getProductById);

router.post("/", createProduct);

router.delete("/:pid", deleteProduct);

module.exports = router;