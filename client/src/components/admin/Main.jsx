import React, { useEffect, useState } from "react";
import { BiPackage } from "react-icons/bi";
import { FaTrafficLight } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { FiUserPlus } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import RevenueChart from "./RevenueChart";
import Header from "./Header";
import { setDataToken } from "../../redux/counterSlice";
import RefreshToken from "../../pages/RefreshToken";
import instace from "../../pages/customer_axios";
import priceFormat from "../../config/priceFormat";

function Main() {
  const counter = useSelector(
    (state) => state.counter
  );
  const { darkmode, dataToken } = counter;
  // const [data, setdata] = useState({
  //   countEmailMessenger: 0,
  //   countPurchasing: 0,
  //   countUser: 0,
  // });

  const dispatch = useDispatch()
  // const Revenue = data.countPurchasing || 0;

  // const [dataNewBuyer, setdataNewBuyer] = useState([])
  const [chartData, setChartData] = useState({ data: [], totleMoneydata: 0 })
  const [dataTrans, setDataTrans] = useState([])

  const [dataOption, setDataOption] = useState({})
console.log(chartData, dataTrans,dataOption )

  // socket.on('register_socket', function (data) {
  //   console.log(data, 12312313);
  // });



  const handletest = () => {
    // socket.emit('soket-reveive', "client to sever ")
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        let newDatatoken = await RefreshToken(dataToken);
        dispatch(setDataToken(newDatatoken));

        const response = await instace.get('/admin/getallpayment', {
          headers: {
            Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""}`,
          },
        });
        setChartData({ data: response.data.data, totleMoneydata: response.data.totleMoneydata })

        newDatatoken = await RefreshToken(newDatatoken);
        dispatch(setDataToken(newDatatoken))
        const responseTran = await instace.get('/admin/getpaymentmost', {
          headers: {
            Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""}`,
          },
        });
        setDataTrans(responseTran.data.data)


        newDatatoken = await RefreshToken(newDatatoken);
        dispatch(setDataToken(newDatatoken))
        const responseOption = await instace.get('/admin/getadminoption', {
          headers: {
            Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""}`,
          },
        });
        setDataOption(responseOption.data)
      } catch (error) {
        console.error("Lỗi xảy ra khi gọi API:", error);
      }
    };

    fetchData();
  }, [])

  let datatop = [
    {
      icon: <BiPackage />,
      label: "Total buyed package",
      amount: dataOption.datapackagebuyed || 0,
    },
    {
      icon: <FcSalesPerformance />,
      label: "Sales Obtained",
      amount: dataOption.payment_total || 0,
    },
    {
      icon: <FiUserPlus />,
      label: "Clients",
      amount: dataOption.datauser || 0,
    },
    {
      icon: <FaTrafficLight />,
      label: "Activity log",
      amount: dataOption.dataaction || 0,
    },
  ];
  return (
    <div className="w-full">
      <Header />
      <div className="pt-12 ">
        <h1 onClick={handletest} className={`text-3xl font-medium ${darkmode ? "text-white" : ""}`}>
          Dashboard
        </h1>
        <p className="text-dashboard">Welcome to your dashboard</p>
      </div>
      <div className=" grid gap-6 grid-cols-4 mt-8">
        {datatop.map((value, index) => {
          return (
            <div
              key={index}
              className={`min-h-[120px] hover:scale-105 ${darkmode ? "dark_mode_bg_items" : ""
                } duration-500 border p-8 rounded-lg  shadow-md bg-gray-50 border-[#4CCEAC] `}
            >
              <div
                className={`text-2xl ${value.label !== "Sales Obtained" ? "text-dashboard" : ""
                  }`}
              >
                {value.icon}
              </div>
              <p
                className={`font-medium text-xl  ${darkmode ? "text-white" : ""
                  }`}
              >
                {value.label === "Sales Obtained"
                  ? `${priceFormat(value.amount)}`
                  : value.amount.toLocaleString("en-US").replace(".00", "")}
              </p>
              <p className="text-dashboard">{value.label}</p>
            </div>
          );
        })}
      </div>

      <div className=" grid grid-cols-12 mt-8 gap-6">
        <div
          className={` col-span-8 min-h-[500px] ${darkmode ? "dark_mode_bg_items" : ""
            } duration-800 border-gray-300 bg-gray-50 rounded-lg px-8 py-4`}
        >
          <h1
            className={`text-xl font-medium  ${darkmode ? "text-white" : ""}`}
          >
            Revenue Generated
          </h1>
          <p className="text-2xl font-bold text-dashboard">
            {priceFormat(chartData.totleMoneydata )}  <i class="fa-solid fa-coins coin"></i>
          </p>
          <div
            className={`w-full min-h-[380px] flex justify-center items-center   ${darkmode ? "dark_mode_bg" : ""
              } `}
          >
            {/* <div className="bg-black w-full h-[400px]"></div> */}
            <RevenueChart data={chartData.data}></RevenueChart>
          </div>
        </div>
        <div
          className={` col-span-4 duration-500 overflow-y-auto border-gray-300   h-[500px] ${darkmode ? "dark_mode_bg_items" : "bg-gray-50"
            } duration-800 rounded-lg`}
        >
          <h1
            className={`p-4 text-xl font-medium ${darkmode ? "text-white " : ""
              }`}
          >
            Recent Transactions
          </h1>
          <div className="">
            {dataTrans.map((value, index) => {
              return (
                <div
                  className={`flex justify-between items-center hover:bg-[#F3F3F3]  px-4  py-4 border-t-2 border-gray-300 ${darkmode ? "hover:!bg-[#141b2d] border-gray-600" : ""
                    }`}
                  key={index}
                >
                  <div>
                    <p className="text-base text-dashboard font-medium w-[200px] overflow-hidden">
                      {value.userId?  value.userId.email: "None" }
                    </p>
                    <p className={`text-sm ${darkmode ? "text-white" : ""}`}>
                      {value.userId?  value.userId.name: "None" }

                    </p>
                  </div>
                  <div className={`${darkmode ? "text-white" : "text-black"}`}>
                    {dayjs(value.createdAt).format("DD/MM/YYYY")}
                  </div>
                  <div>
                    <p className="px-3 py-1 rounded-sm bg-[#4CCEAC] ">
                      {priceFormat(value.amount )}  <i class="fa-solid fa-coins coin"></i>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
