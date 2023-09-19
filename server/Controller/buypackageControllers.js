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

  getAllpackagebuyed: async (req, res) => {
    try {
      const data = await buyerPackageModal.find({userId: req.user.userId});
      res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  buypackage: async (req, res) => {
    try {
      const currentDate = new Date();
      const userdata = await userModal.findOne({ username: req.user.username });
      const productData = await productModal.findOne({ _id: req.body._id });
      const buyerData = await buyerPackageModal.findOne({
        userId: userdata._id,
        key: productData.product_name,
        time_end: { $gt: currentDate },
      });

      if (buyerData) {
        res.status(401).json({ message: "Đã mua" });
      } else {
        if (req.user.totleMoney >= productData.product_price) {
          const timeEnd = new Date(currentDate);
          timeEnd.setDate(currentDate.getDate() + Number(productData.product_timezone)); 
          // timeEnd.setMinutes(currentDate.getMinutes() + 10);

          const create = await buyerPackageModal.create({
            userId: userdata._id,
            time_start: currentDate,
            time_end: timeEnd,
            key: productData.product_name,
            price: productData.product_price,
          });
          let newAction = [];

          if (userdata?.action.length === 0) {
            newAction.push(create);
          } else {
            const checked = userdata?.action.find(
              (value) => value.key == create.key
            );
            if (checked) {
              newAction = userdata?.action.map((value) => {
                if (value.key === create.key) {
                  value = create;
                }
                return value;
              });
            } else {
              newAction = [...userdata?.action, create];
            }
          }

          const update = await userModal.updateOne(
            { username: req.user.username },
            {
              action: [...newAction],
              totleMoney: Number(req.user.totleMoney) - Number(create.price),
              usedMonney: Number(req.user.usedMonney) + Number(create.price),
            }
          );
          console.log(update, "update");
          res.status(200).json({
            message: "Đã mua thành công",
            user: {
              ...req.user,
              action: [...newAction],
              totleMoney: Number(req.user.totleMoney) - Number(create.price),
              usedMonney: Number(req.user.usedMonney) + Number(create.price),
            },
          });
        } else {
          res.status(401).json({ message: "Vui long nap thêm tiền" });
        }
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updatePackage: async (req, res) => {
    try {
      const currentDate = new Date();
      if (req.user.action.length === 0) {
        res
          .status(401)
          .json({ message: "Vui long nap tiền để sử dụng dịch vụ 1", user:req.user });
      } else {
        const packagedata = await productModal.findOne({_id: req.body.idpackage})
        const checked = req.user.action.filter(
          (value) => value.key === packagedata.product_name
        );
        console.log(checked, "checkedchecked");
        if (checked) {
          console.log(checked[0].time_end , currentDate, "checked.timeEnd > currentDate");

          if (new Date(checked[0].time_end).getTime() > currentDate.getTime()) {
            console.log("con han");
            res.status(200).json({ status: true, data: checked });
          } else {
            console.log("het han");
            const newAction = req.user.action.filter(
              (value) => value.key !== packagedata.product_name
            );
            const update = await userModal.updateOne(
              { username: req.user.username },
              {
                action: [...newAction],
              }
            );
            res
              .status(401)
              .json({ message: "Vui long nap tiền để sử dụng dịch vụ 2", user: {...req.user,  action: [...newAction] } });
          }
        } else {
          res
            .status(401)
            .json({ message: "Vui long nap tiền để sử dụng dịch vụ 3", user:req.user });
        }
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = buypackageControllers;
