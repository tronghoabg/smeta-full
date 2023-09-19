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
    product_des :{
      type:String
    }
  },
  { collection: "product" }
);
const productModal = mongoose.model("product", productSchema);

// productModal.create(
//   { product_name: 'Create Ad Account', product_price: 1000 ,product_des:'gói 1 tháng được sử dụng không giới hạn'},
//   { product_name: 'Create Campaign', product_price: 1000 ,product_des:'gói 1 tháng được sử dụng không giới hạn'}
// )
// .then((data) => {
//   console.log(data);
// })
// .catch((err) => {
//   console.log(err);
// });
module.exports = productModal;

