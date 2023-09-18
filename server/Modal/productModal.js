const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/smeta");

const productSchema = mongoose.Schema(
  {
    product_name: {
      type: String,
    },
    product_price: {
      type: Number,
    },
  },
  { collection: "product" }
);

const productModal = mongoose.model("product", productSchema);
module.exports = productModal;
