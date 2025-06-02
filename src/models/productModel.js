const mongoose = require("mongoose");

const productModel = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    details: [
      {
        size: { type: String, required: false },
        quantity: { type: String, default: 1 },
      },
    ],
    price: { type: Number, required: true },
    onSale: { type: Boolean, default: false },
    priceOnSale: { type: Number, required: false },
    images: [{ type: String, requried: true }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "category",
    },
    color: { type: String, required: false },
    brand: { type: String, required: false },
    collection: { type: String, required: false },
    gender: { type: String, required: false },
    season: { type: String, required: false },
    inStock: { type: Number, required: true },
    others: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Products",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Products", productModel);
