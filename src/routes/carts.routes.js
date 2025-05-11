const express = require("express");
const router = express.Router();
const {
  createCart,
  getCartById,
  addProductToCart
} = require("../controllers/carts.controller");

router.post("/", createCart);

router.get("/:cid", getCartById);

router.post("/:cid/products/:pid", addProductToCart);

module.exports = router;