const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    pName: {
      type: String,
      required: true,
    },
    pPrice: {
      type: String,
      required: true,
    },
    pImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
