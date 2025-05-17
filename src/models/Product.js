const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String, default: "" },
    code: { type: String, required: true, unique: true, trim: true },
    stock: { type: Number, default: 0, min: 0 },
    category: { type: String, required: true, trim: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "TechNow",
  }
);


productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", productSchema);