
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tab, Tabs } from '@mui/material';
import { setSelectedDashboard, setprofileId } from '../../redux/counterSlice';
import { BsCardChecklist } from "react-icons/bs";
import { HiOutlineHome } from "react-icons/hi";
import { BiSolidColor } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import { MdOutlineContacts } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
const SidebarOpen = (props) => {
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counter);
  const { loading, payment, isSidebar, darkmode, selectedDashboard } = counter;

  const handleTabChange = (event, newValue) => {
    dispatch(setSelectedDashboard(newValue));
  };
  const nav = useNavigate()

  return (
    <div className="w-full flex justify-start flex-col">
     <div className='flex justify-center items-center w-full'>
     <img
     onClick={()=>{nav('/')}}
        className={`px-6 duration-500 w-[200px] text-center cursor-pointer  mb-[50px] ${isSidebar ? '' : 'scale-0 w-0 h-0'}`}
        src="/logo.png"
        alt=""
      />
     </div>
      <div
        className={`text-center mb-10 duration-500 ${isSidebar ? '' : 'w-0 h-0 scale-0'
          }`}
      >
        <h1
          className={`text-[32px] font-medium ${darkmode ? 'text-white' : ''
            }`}
        >
          Trọng Hòa
        </h1>
        <p className="text-dashboard">Smeta Admin</p>
      </div>
      <Tabs
        value={selectedDashboard}
        onChange={handleTabChange}
        orientation="vertical"
        scrollButtons="auto"
        variant="scrollable"
        textColor="primary"
        indicatorColor="primary"
        className={` ${isSidebar ? "": ""} ${isSidebar ? '' : ''
          } pr-18 ${darkmode ? 'bg-[#1f2a40] !text-white' : 'bg-[#fff]'}`}
      >
        <Tab
          label={isSidebar ? "Dashboard" : ""}
          value="main"
          icon={
            <HiOutlineHome
              className={`text-xl  ${isSidebar ? '' : '!m-0'
                } ${darkmode ? '!text-white' : ''}`}
            />
          }
        />
        <Tab
        onClick={()=>{dispatch(setprofileId(""))}}
          label={isSidebar ? "User" : ""}
          value="team"
          icon={
            <LuUsers
              className={`text-xl  ${isSidebar ? '' : '!m-0'
                } ${darkmode ? '!text-white' : ''}`}
            />
          }
        />
        <Tab
          label={isSidebar ? "Activity log" : ""}
          value="Activity"
          icon={
            <MdOutlineContacts
              className={`text-xl  ${isSidebar ? '' : '!m-0'
                } ${darkmode ? '!text-white' : ''}`}
            />
          }
        />
        <Tab
          label={isSidebar ? "Invoices Balances" : ""}

          value="invoices"
          icon={
            <BsCardChecklist
              className={`text-xl  ${isSidebar ? '' : '!m-0'
                } ${darkmode ? '!text-white' : ''}`}
            />
          }
        />
         <Tab
          label={isSidebar ? "Package" : ""}

          value="package"
          icon={
            <BiSolidColor
              className={`text-xl  ${isSidebar ? '' : '!m-0'
                } ${darkmode ? '!text-white' : ''}`}
            />
          }
        />
      </Tabs>
      
    </div>
  );
};

export default SidebarOpen;
