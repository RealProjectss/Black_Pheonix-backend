const mongoose = require("mongoose");

const catalogueModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("catalogue", catalogueModel);
