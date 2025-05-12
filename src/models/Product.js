const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2"); // Asegúrate de tener este paquete instalado

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    thumbnail: String,
    code: { type: String, required: true, unique: true },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Aplicar el plugin de paginación
productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", productSchema);