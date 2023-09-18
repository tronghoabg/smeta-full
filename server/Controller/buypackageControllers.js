const e = require("express");
const buyerPackageModal = require("../Modal/buyerPackageModal");
const paymentModal = require("../Modal/paymentModal");
const productModal = require("../Modal/productModal");
const userModal = require("../Modal/userModal");

const buypackageControllers = {
  getAllProduct: async (req, res) => {
    try {
      const data = await productModal.find();
      res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  buypackage: async (req, res) => {
    try {
      const currentDate = new Date();
      const userdata = await userModal.findOne({ username: req.user.username });
      const productData = await productModal.findOne({ _i: req.body._id });

      const buyerData = await buyerPackageModal.findOne({
        userId: userdata._id,
        key: productData.product_name,
        time_end: { $gt: currentDate },
      });

      if (buyerData) {
        res.status(401).json({ message: "Đã mua" });
      } else {
        if (req.user.totleMoney >= productData.price) {
          const timeEnd = new Date(currentDate);
          timeEnd.setDate(currentDate.getDate() + 30);

          const create = await buyerPackageModal({
            userId: userdata._id,
            time_start: currentDate,
            time_end: timeEnd,
            key: productData.product_name,
            price: productData.price,
          });
          const newAction = userdata?.action.map((value=>{
            if(value.key === create.key){
                value = create
            }
            return value
          }))

          const update = await userdata.updateOne(
            { username: req.user.username },
            {
              action: [...newAction],
              totleMoney: Number(req.user.totleMoney) - Number(create.price),
              usedMonney: Number(req.user.usedMonney) + Number(create.price),
            }
          );
        } else {
          res.status(401).json({ message: "Vui long nap thêm tiền" });
        }
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = buypackageControllers;
