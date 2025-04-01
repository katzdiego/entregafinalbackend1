const { Router } = require("express");
const CartManager = require("../managers/CartManager");

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.save();
    return res.status(201).json(newCart);
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    return res.status(500).json({ error: "Error interno al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    if (isNaN(cartId)) {
      return res.status(400).json({ error: "ID de carrito inválido" });
    }

    const cart = await cartManager.getById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    return res.json(cart);
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    return res.status(500).json({ error: "Error interno al obtener el carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    if (isNaN(cartId) || isNaN(productId)) {
      return res.status(400).json({ error: "ID de carrito o producto inválido" });
    }

    const cart = await cartManager.addProduct(cartId, productId);
    if (!cart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }

    return res.json(cart);
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    return res.status(500).json({ error: "Error interno al agregar producto al carrito" });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    if (isNaN(cartId) || isNaN(productId)) {
      return res.status(400).json({ error: "ID de carrito o producto inválido" });
    }

    const cart = await cartManager.removeProduct(cartId, productId);
    if (!cart) {
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }

    return res.json(cart);
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    return res.status(500).json({ error: "Error interno al eliminar producto del carrito" });
  }
});

module.exports = router;