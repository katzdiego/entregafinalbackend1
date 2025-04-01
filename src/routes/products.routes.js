const { Router } = require("express");
const ProductManager = require("../managers/ProductManager");

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getById(parseInt(req.params.pid));
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = await productManager.save(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productManager.update(parseInt(req.params.pid), req.body);
    if (!updatedProduct) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deletedId = await productManager.delete(parseInt(req.params.pid));
    if (!deletedId) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ deletedId });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

module.exports = router;