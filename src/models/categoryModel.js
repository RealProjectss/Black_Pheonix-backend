const mongoose = require("mongoose");

const categoryModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("category", categoryModel);
