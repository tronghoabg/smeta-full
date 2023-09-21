import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Main from "./Main";
import { useSelector } from "react-redux";
import Team from "./Team";
import Acctionadmin from "./Acctionadmin";
function Dashboard({setdisable}) {
  useEffect(()=>{
    setdisable(false)
  },[])
  const counter = useSelector((state) => state.counter);
  const { loading, payment, isSidebar, darkmode, selectedDashboard } = counter;



  return (
    <div className={`flex  min-h-screen bg-[#fff] duration-800 ${darkmode ? "dark_mode_bg" : ""}`}>
      <div className={`w-[300px] border-r border-gray-300  h-full duration-800 ${!isSidebar ? "!w-[80px]" : ""}`}>
        <Sidebar />
      </div>
      <div className={`w-full h-full duration-800 p-4 ${!isSidebar ? "w-full" : ""}`}>
        <Render />
      </div>
    </div>
  );
}


const Render = () => {
  const counter = useSelector((state) => state.counter);
  const { loading, payment, isSidebar, darkmode, selectedDashboard } = counter;
  switch (selectedDashboard) {
    case "main":
      return <Main />
    case "team":
      return <Team />
    case "Activity":
      return <Acctionadmin />
    case "main":
      return <Main />
    default:
      return <Main />
  }
}





export default Dashboard;
