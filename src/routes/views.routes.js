const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Vista principal: listado de productos
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("index", { products });
  } catch (error) {
    console.error("❌ Error al cargar la vista:", error);
    res.status(500).send("Error al cargar los productos");
  }
});

// Vista de detalle de producto
router.get("/product/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");

    // ID real del carrito creado con Postman
    const cartId = "6827e62f3f97bfe07c12a17d";

    res.render("productDetail", { product, cartId });
  } catch (error) {
    console.error("❌ Error al cargar el detalle:", error);
    res.status(500).send("Error al cargar el producto");
  }
});

module.exports = router;