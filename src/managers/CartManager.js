const fs = require("fs");
const path = require("path");

class CartManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/carts.json");
  }

  async getAll() {
    try {
      if (!fs.existsSync(this.filePath)) return [];
      const data = await fs.promises.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer los carritos:", error);
      return [];
    }
  }

  async getById(id) {
    try {
      const carts = await this.getAll();
      const cart = carts.find(cart => cart.id === parseInt(id));
      return cart || null;
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
      return null;
    }
  }

  async save() {
    try {
      const carts = await this.getAll();
      const newCart = {
        id: carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1,
        products: []
      };

      carts.push(newCart);
      await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      console.error("Error al guardar el carrito:", error);
      return null;
    }
  }

  async addProduct(cartId, productId) {
    try {
      if (isNaN(cartId) || isNaN(productId)) {
        console.error("IDs inválidos en addProduct");
        return null;
      }

      const carts = await this.getAll();
      const cart = carts.find(c => c.id === cartId);
      if (!cart) return null;

      const productExists = cart.products.find(p => p.id === productId);
      if (productExists) {
        productExists.quantity += 1;
      } else {
        cart.products.push({ id: productId, quantity: 1 });
      }

      await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      return null;
    }
  }

  async removeProduct(cartId, productId) {
    try {
      if (isNaN(cartId) || isNaN(productId)) {
        console.error("IDs inválidos en removeProduct");
        return null;
      }

      const carts = await this.getAll();
      const cart = carts.find(c => c.id === cartId);
      if (!cart) return null;

      const productIndex = cart.products.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        console.error(`Producto con ID ${productId} no encontrado en el carrito ${cartId}`);
        return null;
      }

      cart.products.splice(productIndex, 1);
      await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      return null;
    }
  }
}

module.exports = CartManager;