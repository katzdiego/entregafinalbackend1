const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/products.json");
  }

  async getAll() {
    try {
      if (!fs.existsSync(this.filePath)) return [];
      const data = await fs.promises.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer los productos:", error);
      return [];
    }
  }

  async getById(id) {
    try {
      const products = await this.getAll();
      return products.find(product => product.id === parseInt(id)) || null;
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error);
      return null;
    }
  }

  async save(product) {
    try {
      const products = await this.getAll();
      const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        ...product
      };
      products.push(newProduct);
      await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      return null;
    }
  }

  async update(id, productUpdates) {
    try {
      const products = await this.getAll();
      const index = products.findIndex(p => p.id === parseInt(id));
      if (index === -1) return null;

      const updatedProduct = { ...products[index], ...productUpdates };
      products[index] = updatedProduct;
      await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return updatedProduct;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      return null;
    }
  }

  async delete(id) {
    try {
      const products = await this.getAll();
      const index = products.findIndex(p => p.id === parseInt(id));
      if (index === -1) return null;

      const [deletedProduct] = products.splice(index, 1);
      await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return deletedProduct.id;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return null;
    }
  }
}

module.exports = ProductManager;