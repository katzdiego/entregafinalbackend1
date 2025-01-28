const { Router } = require("express");
const ProductManager = require("../managers/ProductManager");

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await productManager.getAll();
  res.json(products);
});

router.get("/:pid", async (req, res) => {
  const product = await productManager.getById(parseInt(req.params.pid));
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

router.post("/", async (req, res) => {
  const product = await productManager.save(req.body);
  res.status(201).json(product);
});

router.put("/:pid", async (req, res) => {
  const updatedProduct = await productManager.update(parseInt(req.params.pid), req.body);
  if (!updatedProduct) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(updatedProduct);
});

router.delete("/:pid", async (req, res) => {
  const deletedId = await productManager.delete(parseInt(req.params.pid));
  res.json({ deletedId });
});

module.exports = router;