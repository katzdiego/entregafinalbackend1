const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.createCart = async (req, res) => {
  try {
    const newCart = new Cart();
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
};

exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    res.render("cartDetail", { cart });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

exports.addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    const existingProductIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto al carrito", details: error.message });
  }
};

exports.updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    let { quantity } = req.body;

    quantity = parseInt(quantity);
    if (isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ error: "Cantidad inválida" });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (!productInCart) return res.status(404).json({ error: "Producto no encontrado en el carrito" });

    productInCart.quantity = quantity;
    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la cantidad del producto", details: error.message });
  }
};

exports.updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "Formato de productos inválido" });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = products.map(p => ({
      product: p.product,
      quantity: p.quantity,
    }));

    await cart.save();
    res.json({ message: "Carrito actualizado", cart });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar productos del carrito", details: error.message });
  }
};

exports.deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);

    await cart.save();
    res.json({ message: "Producto eliminado del carrito", cart });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto del carrito", details: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    res.json({ message: "Carrito vaciado", cart });
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar el carrito", details: error.message });
  }
};