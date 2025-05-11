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
    const cart = await Cart.findById(req.params.cid).populate("products.product");
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

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
};

exports.deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto del carrito" });
  }
};

exports.updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = products;
    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
};

exports.updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (!productInCart) return res.status(404).json({ error: "Producto no encontrado en el carrito" });

    productInCart.quantity = quantity;
    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la cantidad del producto" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
};