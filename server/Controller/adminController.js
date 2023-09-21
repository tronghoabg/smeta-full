const userModal = require("../Modal/userModal");
const acctionModal = require("../Modal/acctionModal");
const paymentModal = require("../Modal/paymentModal");
const buyerPackageModal = require("../Modal/buyerPackageModal");
const adminController = {
  getallUser: async (req, res) => {
    try {
      const data = await userModal.find();
      res.status(200).json({ message: "sucsess", data });
    } catch (error) {
      res.status(500).json({ message: "lỗi server" });
    }
  },
  getallAction: async (req, res) => {
    try {
      const data = await acctionModal.find();
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
      const data = await paymentModal
        .find()
        .populate("userId");
        console.log(data,'11111')
      res.status(200).json({ message: "sucsess", data });
    } catch (error) {
      res.status(500).json({ message: "lỗi server" });
    }
  },
  searchProduct: async (req, res) => {
    try {
      const data = await userModal.find();
      const keyword = req.body.searchbyname.trim().toLowerCase(); 
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
  }
}

module.exports = adminController;




