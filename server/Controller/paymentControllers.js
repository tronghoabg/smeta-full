const paymentModal = require("../Modal/paymentModal");
const userModal = require("../Modal/userModal");

const paymentControllers = {
  creatPayment: async (req, res) => {
    try {
      const userdata = await userModal.findOne({ username: req.user.username });
      const checked = await paymentModal.findOne({
        orderCode: req.body.orderCode,
      });
      if (checked) {
        // return res.redirect("/");
        return res.status(200).json({ message: "Error" });
      } else {
        const createpayment = await paymentModal.create({
          userId: userdata._id,
          orderCode: req.body.orderCode,
          createdAt: req.body.createdAt,
          amount: req.body.amount,
          status: req.body.status,
          signature: req.body.signature,
        });

        const updateUser = await userModal.updateOne(
          { username: req.user.username },
          { $inc: { totleMoney: req.body.amount } } // Sử dụng $inc để tăng giá trị của totalMoney
        );
        res.status(200).json({ message: "success", data: createpayment, user: req.user});
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getuserpayment: async(req, res) =>{
    try {
      const userdata = await userModal.findOne({ username: req.user.username });

      const data = await paymentModal.find({userId: userdata._id})
      res.status(200).json(data)
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

module.exports = paymentControllers;
