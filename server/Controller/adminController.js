const userModal = require("../Modal/userModal");
const acctionModal = require("../Modal/acctionModal");
const paymentModal = require("../Modal/paymentModal");
const buyerPackageModal = require("../Modal/buyerPackageModal");
const { server } = require("../server")
// const io = require('socket.io')(server);


const adminController = {
  getallUser: async (req, res) => {
    try {
      const data = await userModal.find().sort({ _id: -1 });
      res.status(200).json({ message: "sucsess", data });
    } catch (error) {
      res.status(500).json({ message: "lỗi server" });
    }
  },
  getallAction: async (req, res) => {
    try {
      const data = await acctionModal.find().sort({ _id: -1 });
      res.status(200).json({ message: "sucsess", data });
    } catch (error) {
      res.status(500).json({ message: "lỗi server" });
    }
  },
  AdmingetAllpayment: async (req, res) => {
    try {
      const currentDate = new Date();
      const sevenMonthsAgo = new Date(currentDate);

      sevenMonthsAgo.setMonth(currentDate.getMonth() - 7);
      const data = await paymentModal.find({
        createdAt: { $gte: sevenMonthsAgo },
      });

      const currentMonth = currentDate.getMonth(); // Lấy tháng hiện tại (0-11)
      const currentYear = currentDate.getFullYear(); // Lấy năm hiện tại

      const numberOfMonthsToRetrieve = 7; // Số tháng cần lấy

      const recentMonths = [];

      let totleMoneydata = 0;

      // Lặp qua số tháng cần lấy
      for (let i = 0; i < numberOfMonthsToRetrieve; i++) {
        // Tính tháng và năm của tháng cần lấy
        const targetMonth = (currentMonth - i + 12) % 12; // Tháng 0 đến 11
        const targetYear =
          currentYear - Math.floor((currentMonth - i + 12) / 12);

        // Biểu diễn tháng và năm dưới dạng chuỗi 'tháng-năm' và thêm vào mảng recentMonths
        const formattedMonthYear = `${targetYear + 1}-${targetMonth + 1}`;
        recentMonths.push(formattedMonthYear);
      }
      const FormatData = [];
      data.forEach((item) => {
        const month = item.createdAt.getMonth() + 1; // Lấy tháng (cộng 1 vì tháng trong JavaScript bắt đầu từ 0)
        const year = item.createdAt.getFullYear();
        const dateKey = `${year}-${month}`; // Tạo khóa cho tháng và năm

        // Tìm xem tháng và năm đã có trong mảng kết quả chưa
        const existingMonth = FormatData.find(
          (entry) => entry.date === dateKey
        );
        if (existingMonth) {
          // Nếu tháng và năm đã tồn tại, cộng thêm vào totalprice
          existingMonth.totalprice += item.amount;
          if (existingMonth.userId != item.userId) {
            existingMonth.totaluser += 1;
          }
        } else {
          // Nếu tháng và năm chưa tồn tại, thêm một mục mới vào mảng kết quả
          FormatData.push({
            date: dateKey,
            totalprice: item.amount,
            totaluser: 1,
            userId: item.userId,
          });
        }
      });
      const test = recentMonths.map((value) => {
        let newdata = { name: `Tháng ${value.split("-")[1]}`, $: 0, user: 0 };
        FormatData.map((item) => {
          if (item.date === value) {
            newdata = { ...newdata, user: item.totaluser, $: item.totalprice };
          }
        });
        totleMoneydata += newdata.$;
        return newdata;
      });
      res
        .status(200)
        .json({ data: test.reverse(), totleMoneydata: totleMoneydata });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getmosttimepayment: async (req, res) => {
    try {
      const data = await paymentModal
        .find()
        .sort({ _id: -1 })
        .limit(10)
        .populate("userId");
      res.status(200).json({ message: "sucsess", data });
    } catch (error) {
      res.status(500).json({ message: "lỗi server" });
    }
  },

  getadminoption: async (req, res) => {
    try {
      const datauser = await userModal.find();
      const dataaction = await acctionModal.find();
      const datapayemt = await paymentModal.find();
      let payment_total = 0;
      datapayemt.map((value) => {
        payment_total += value.amount;
      });
      const datapackagebuyed = await buyerPackageModal.find();
      res
        .status(200)
        .json({
          datapackagebuyed: datapackagebuyed.length,
          payment_total,
          datauser: datauser.length,
          dataaction: dataaction.length,
        });
    } catch (error) {
      res.status(500).json({ message: "lỗi server" });
    }
  },
  getallpayment: async (req, res) => {
    try {
      const payments = await paymentModal.find().populate("userId");
      const outputData = payments.map(payment => {
        const { _id, username } = payment.userId;
        return {
          _id,
          username,
          orderCode: payment.orderCode,
          amount: payment.amount,
          signature: payment.signature,
          createdAt: payment.createdAt
        };
      });

      res.status(200).json({ message: "success", data: outputData });
    } catch (error) {
      res.status(500).json({ message: "lỗi server" });
    }
  },



  searchProduct: async (req, res) => {
    try {
      const data = await userModal.find();
      const keyword = req.query.searchbyname.trim().toLowerCase();
      const results = data.filter((item) => {
        for (const key in item) {
          if (typeof item[key] === 'string' || typeof item[key] === 'number') {
            const normalizedValue = String(item[key]).trim().toLowerCase();
            if (normalizedValue.includes(keyword)) {
              return true;
            }
          }
        }
        return false;
      });
      res.status(200).json(results);
    } catch (error) {
      console.error('Lỗi:', error);
      res.status(500).json(error);
    }
  },
  getUserBuyId: async (req, res) => {
    try {
      const userProfile = await userModal.find({ _id: req.params.profileId })
      const userPayment = await paymentModal.find({ userId: req.params.profileId })
      const userBuyed = await buyerPackageModal.find({ userId: req.params.profileId })
      newdata = [...userPayment, ...userBuyed]
      newdata = newdata.map(value => {
        if (value.key) {
          value.createdAt = value.time_start
        }
        return value
      }).sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA;
      });

      res.status(200).json({ userProfile: userProfile[0], userPayment: newdata });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  searchAction: async (req, res) => {
    try {
      const data = await acctionModal.find();
      const keyword = req.query.searchbyname.trim().toLowerCase();
      const results = data.filter((item) => {
        for (const key in item) {
          if (typeof item[key] === 'string' || typeof item[key] === 'number') {
            const normalizedValue = String(item[key]).trim().toLowerCase();
            if (normalizedValue.includes(keyword)) {
              return true;
            }
          }
        }
        return false;
      });
      res.status(200).json(results);
    } catch (error) {
      console.error('Lỗi:', error);
      res.status(500).json(error);
    }
  },
  searchPayment: async (req, res) => {
    try {

      const data = await paymentModal
        .find()
        .populate("userId");
      const outputData = data.map(payment => {
        const { _id, username } = payment.userId;
        return {
          _id,
          username,
          orderCode: payment.orderCode,
          amount: payment.amount,
          signature: payment.signature,
          createdAt: payment.createdAt
        };
      });
      const keyword = req.query.searchbyname.trim().toLowerCase();
      const results = outputData.filter((item) => {
        for (const key in item) {
          if (typeof item[key] === 'string' || typeof item[key] === 'number') {
            const normalizedValue = String(item[key]).trim().toLowerCase();
            if (normalizedValue.includes(keyword)) {
              return true;
            }
          }
        }
        return false;
      });
      res.status(200).json(results);
    } catch (error) {
      console.error('Lỗi:', error);
      res.status(500).json(error);
    }
  },
  updateoneuser: async (req, res) => {
    try {
      const username = req.body.username
      const email = req.body.email
      const phone = req.body.phone
      const role = req.body.role
      const totleMoney = req.body.totalmoney
      const action = req.body.action
     const datauser = userModal.find({username:username})
     const datauseraction = datauser.action
      const dataaction = action.map((value,index)=>{
        const date = new Date
       return {key:value,time_end: date.setFullYear(date.getFullYear() + 100)}
      })
      const update = await userModal.updateOne({ _id: req.params.id }, {
        username :username,
        phone:phone,
        email:email,
        role:role,
        totleMoney:totleMoney,
        action:dataaction
      })
      let data = await userModal.find()
      res.status(200).json({ message: 'sucsess', data })
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = adminController;




