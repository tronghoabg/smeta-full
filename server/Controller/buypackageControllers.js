const e = require("express");
const buyerPackageModal = require("../Modal/buyerPackageModal");
const paymentModal = require("../Modal/paymentModal");
const productModal = require("../Modal/productModal");
const userModal = require("../Modal/userModal");
const acctionModal = require("../Modal/acctionModal");
const buypackageControllers = {
  getAllProduct: async (req, res) => {
    try {
      const data = await productModal.find();
      const filteredData = data.filter(item => item.product_name !== 'share pixel').sort((a, b) => {
        const nameA = a.product_name.toUpperCase(); // Để đảm bảo không phân biệt chữ hoa chữ thường
        const nameB = b.product_name.toUpperCase();
        
        if (nameA > nameB) {
          return -1; // Sử dụng -1 để đảm bảo sắp xếp giảm dần
        }
        if (nameA < nameB) {
          return 1; // Sử dụng 1 để đảm bảo sắp xếp giảm dần
        }
        return 0;
      })
      res.status(200).json(filteredData);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAllpackagebuyed: async (req, res) => {
    try {
      const data = await buyerPackageModal.find({ userId: req.user.userId });
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
      const realPrice = productData.product_desc_discount > 0 ? productData.product_price * ((100 - productData.product_desc_discount)/100) : productData.product_price
      const checkeddata = await buyerPackageModal.findOne({
        userId: userdata._id,
        key: "All",
        time_end: { $gt: currentDate },
      });
      if(checkeddata){
        return res.status(401).json({ message: "Đã mua" });
      }
      const buyerData = await buyerPackageModal.findOne({
        userId: userdata._id,
        key: productData.product_name,
        time_end: { $gt: currentDate },
      });

      if (buyerData) {
        res.status(401).json({ message: "Đã mua" });
      } else {
        if (req.user.totleMoney >=realPrice) {
          const timeEnd = new Date(currentDate);
          timeEnd.setDate(
            currentDate.getDate() + Number(productData.product_timezone)
          );
          // timeEnd.setMinutes(currentDate.getMinutes() + 10);

          const create = await buyerPackageModal.create({
            userId: userdata._id,
            time_start: currentDate,
            time_end: timeEnd,
            key: productData.product_name,
            price:realPrice,
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
      const packagedata = await productModal.findOne({
        product_name: req.body.product_name,
      });
      const checked = req.user.action.filter(
        (value) => value.key === packagedata.product_name
      );

      const checkedAll = req.user.action.filter((value) => value.key === "All");
      if (checkedAll.length > 0) {
        if (
          new Date(checkedAll[0].time_end).getTime() > currentDate.getTime()
        ) {
          const data_action = await acctionModal.create({
            name: req.user.username,
            acction: packagedata.product_name,
            ip: req.ip,
            language: req.user.language,
            date: new Date(),
          });
          let data = await acctionModal.find().sort({ _id: -1 })
          res.io.emit("action_socket", {data:data, key: "action_socket"});

          return res
            .status(200)
            .json({ status: true, data: checkedAll, data_action: data_action });
        }
        const newAction = req.user.action.filter(
          (value) => value.key !== packagedata.product_name
        );
        const update = await userModal.updateOne(
          { username: req.user.username },
          {
            action: [...newAction],
          }
        );
        res.status(401).json({
          message: "Vui lòng nạp tiền để sử dụng dịch vụ ",
          user: { ...req.user, action: [...newAction] },
          status: false,
        });
      }

      if (checked.length > 0) {
        // console.log(checked[0].time_end, currentDate, "checked.timeEnd > currentDate");

        if (new Date(checked[0].time_end).getTime() > currentDate.getTime()) {
          console.log(req.user.username, packagedata.product_name);
          const data_action = await acctionModal.create({
            name: req.user.username,
            acction: packagedata.product_name,
            ip: req.ip,
            language: req.user.language,
            date: new Date(),
          });
          res.io.emit("action_socket", {data:userdata, key: "action_socket"});
          res
            .status(200)
            .json({ status: true, data: checked, data_action: data_action });
        } else {
          const newAction = req.user.action.filter(
            (value) => value.key !== packagedata.product_name
          );
          const update = await userModal.updateOne(
            { username: req.user.username },
            {
              action: [...newAction],
            }
          );
          res.status(401).json({
            message: "Vui lòng nạp tiền để sử dụng dịch vụ ",
            user: { ...req.user, action: [...newAction] },
            status: false,
          });
        }
      } else {
        res.status(401).json({
          message: "Vui lòng nạp tiền để sử dụng dịch vụ ",
          user: req.user,
          status: false,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
  },
};

module.exports = buypackageControllers;
