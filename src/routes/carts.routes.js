const { Router } = require("express");
const CartManager = require("../managers/CartManager");

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  const newCart = await cartManager.save();
  res.status(201).json(newCart);
});

router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getById(parseInt(req.params.cid));
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cart = await cartManager.addProduct(parseInt(req.params.cid), parseInt(req.params.pid));
  if (!cart) return res.status(404).json({ error: "Carrito o producto no encontrado" });
  res.json(cart);
});

module.exports = router;