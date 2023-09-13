import React from "react";
import { Button } from "antd";
import SidebarOpen from "./SidebarOpen";
import { useDispatch, useSelector } from "react-redux";
import { setisSidebar } from "../../redux/counterSlice";
import { PiListBold } from "react-icons/pi";

const Sidebar = () => {
  const counter = useSelector((state) => state.counter);
  const { isSidebar, darkmode } = counter;
  const dispatch = useDispatch();

  return (
    <div className="w-full h-screen">
      <div
        className={`flex mb-8 justify-between px-6 pt-4  ${
          isSidebar ? "" : "!justify-center hover:bg-[#F3F3F3] !p-4"
        } ${!isSidebar && darkmode ? "hover:!bg-[#1f2a40] " : ""}`}
      >
        <h1
          className={`font-medium text-xl duration-500 ${
            isSidebar ? "" : "hidden w-0 h-0"
          } ${darkmode ? "!text-white" : "!text-black"}`}
        >
          ADMIN
        </h1>
        <Button
          onClick={() => {
            dispatch(setisSidebar(!isSidebar));
          }}
          className="border-0 !shadow-none hover:!text-black"
        >
          <PiListBold
            className={`text-xl opacity-60  ${
              darkmode ? "text-white" : "!text-black"
            }  hover:opacity-100`}
          />
        </Button>
      </div>

      <SidebarOpen />
    </div>
  );
};

export default Sidebar;
