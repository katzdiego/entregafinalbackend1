const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/products.json");
  }

  async getAll() {
    if (!fs.existsSync(this.filePath)) return [];
    const data = await fs.promises.readFile(this.filePath, "utf-8");
    return JSON.parse(data);
  }

  async getById(id) {
    const products = await this.getAll();
    return products.find((product) => product.id === id);
  }

  async save(product) {
    const products = await this.getAll();
    product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    products.push(product);
    await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return product;
  }

  async update(id, updatedFields) {
    const products = await this.getAll();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updatedFields, id };
    await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return products[index];
  }

  async delete(id) {
    const products = await this.getAll();
    const updatedProducts = products.filter((product) => product.id !== id);
    await fs.promises.writeFile(this.filePath, JSON.stringify(updatedProducts, null, 2));
    return id;
  }
}

module.exports = ProductManager;