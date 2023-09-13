import React, { useEffect, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { FaTrafficLight } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { FiUserPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import RevenueChart from "./RevenueChart";
import Header from "./Header";


function Main() {
  const counter = useSelector(
    (state) => state.counter
  );
  const { loading, payment, isSidebar, darkmode } = counter;
  const [data, setdata] = useState({
    countEmailMessenger: 0,
    countPurchasing: 0,
    countUser: 0,
  });
  const Revenue = data.countPurchasing || 0;

  const [Render, setRender] = useState(null)

  const [dataNewBuyer, setdataNewBuyer] = useState([])



  let datatop = [
    {
      icon: <AiOutlineMail />,
      label: "Emails Sent",
      amount: data.countEmailMessenger || 0,
    },
    {
      icon: <FcSalesPerformance />,
      label: "Sales Obtained",
      amount: data.countPurchasing || 0,
    },
    {
      icon: <FiUserPlus />,
      label: "Clients",
      amount: data.countUser || 0,
    },
    {
      icon: <FaTrafficLight />,
      label: "Traffic Received",
      amount: 1325134,
    },
  ];
  return (
    <div className="w-full">
      <Header/>
      <div className="pt-12 ">
        <h1 className={`text-3xl font-medium ${darkmode ? "text-white" : ""}`}>
          Dashboard
        </h1>
        <p className="text-dashboard">Welcome to your dashboard</p>
      </div>
      <div className=" grid gap-6 grid-cols-4 mt-8">
        {datatop.map((value, index) => {
          return (
            <div
              key={index}
              className={`min-h-[120px] hover:scale-105 ${
                darkmode ? "dark_mode_bg_items" : ""
              } duration-500 border p-8 rounded-lg  shadow-md bg-gray-50 border-[#4CCEAC] `}
            >
              <div
                className={`text-2xl ${
                  value.label !== "Sales Obtained" ? "text-dashboard" : ""
                }`}
              >
                {value.icon}
              </div>
              <p
                className={`font-medium text-xl  ${
                  darkmode ? "text-white" : ""
                }`}
              >
                {value.label == "Sales Obtained"
                  ? value.amount
                      .toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })
                      .replace(".00", "")
                  : value.amount.toLocaleString("en-US").replace(".00", "")}
              </p>
              <p className="text-dashboard">{value.label}</p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-start mt-8 gap-6">
        <div
          className={` col-span-2 w-[800px] min-[1320px]:w-[1000px] min-h-[500px] ${
            darkmode ? "dark_mode_bg_items" : ""
          } duration-800 border-gray-300 bg-gray-50 rounded-lg px-8 py-4`}
        >
          <h1
            className={`text-xl font-medium  ${darkmode ? "text-white" : ""}`}
          >
            Revenue Generated
          </h1>
          <p className="text-2xl font-bold text-dashboard">
            {Revenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }).replace(".00", "")}
          </p>
          <div
            className={`w-full min-h-[380px] flex justify-center items-center   ${
              darkmode ? "dark_mode_bg" : ""
            } `}
          >
            {/* <div className="bg-black w-full h-[400px]"></div> */}
            <RevenueChart></RevenueChart>
          </div>
        </div>
        <div
          className={` ${isSidebar ? "w-[600px]": "w-[800px]"} duration-500 overflow-y-auto border-gray-300   h-[500px] ${
            darkmode ? "dark_mode_bg_items" : "bg-gray-50"
          } duration-800 rounded-lg`}
        >
          <h1
            className={`p-4 text-xl font-medium ${
              darkmode ? "text-white " : ""
            }`}
          >
            Recent Transactions
          </h1>
          <div className="">
            {dataNewBuyer.map((value, index) => {
              return (
                <div
                  className={`flex justify-between items-center hover:bg-[#F3F3F3]  px-4  py-4 border-t-2 border-gray-300 ${
                    darkmode ? "hover:!bg-[#141b2d] border-gray-600" : ""
                  }`}
                  key={index}
                >
                  <div>
                    <p className="text-base text-dashboard font-medium w-[200px] overflow-hidden">
                      {value.user.email}
                    </p>
                    <p className={`text-sm ${darkmode ? "text-white" : ""}`}>
                      {value.user.name}
                    </p>
                  </div>
                  <div className={`${darkmode ? "text-white" : "text-black"}`}>
                    {dayjs(value.createdAt).format("DD/MM/YYYY")}
                  </div>
                  <div>
                    <p className="px-3 py-1 rounded-sm bg-[#4CCEAC] ">
                      {Number(value.value)
                        .toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                        .replace(".00", "")}
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
