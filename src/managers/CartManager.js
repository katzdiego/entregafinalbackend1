const fs = require("fs");
const path = require("path");

class CartManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/carts.json");
  }

  async getAll() {
    if (!fs.existsSync(this.filePath)) return [];
    const data = await fs.promises.readFile(this.filePath, "utf-8");
    return JSON.parse(data);
  }

  async getById(id) {
    const carts = await this.getAll();
    return carts.find((cart) => cart.id === id);
  }

  async save() {
    const carts = await this.getAll();
    const newCart = { id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1, products: [] };
    carts.push(newCart);
    await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProduct(cartId, productId) {
    const carts = await this.getAll();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) return null;

    const existingProduct = cart.products.find((p) => p.product === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return cart;
  }
}

module.exports = CartManager;