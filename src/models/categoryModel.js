const mongoose = require("mongoose");

const categoryModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("category", categoryModel);
