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

    for (const p of products) {
      if (!p.product || typeof p.quantity !== "number" || p.quantity < 1) {
        return res.status(400).json({ error: "Producto con formato inválido en la lista" });
      }
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = products;
    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el carrito", details: error.message });
  }
};