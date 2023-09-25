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
    product_timezone: {
      type: Number,
    },
    product_desc: {
      type: String,
    },
    product_desc_discount: {
      type: Number,
    },
  },
  { collection: "product" }
);
const productModal = mongoose.model("product", productSchema);


module.exports = productModal;
