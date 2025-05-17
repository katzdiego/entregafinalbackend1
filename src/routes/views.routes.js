const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("index", { products });
  } catch (error) {
    console.error("❌ Error al cargar la vista:", error);
    res.status(500).send("Error al cargar los productos");
  }
});

module.exports = router;