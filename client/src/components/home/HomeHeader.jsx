import React, { useState } from "react";
import { Link, useNavigate, useRoutes } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import instace from "../../pages/customer_axios";
import { setUser, setDataToken } from "../../redux/counterSlice";
import RefreshToken from "../../pages/RefreshToken";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";


function HomeHeader() {
  const nav = useNavigate();
  const counter = useSelector((state) => state.counter);
  let { dataToken, user } = counter
  const handleRedirectLogin = () => {
    nav("/login");
  };
  const { i18n } = useTranslation();
  const [lng, setLng] = useState('vi');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    console.log(lng, 'lng')
    setLng(lng)
  }
  const handleRedirectregister = () => {
    nav("/register");
  };
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      const newDatatoken = await RefreshToken(dataToken);
      dispatch(setDataToken(newDatatoken));
      console.log(newDatatoken, "newDatatoken");
      const headers = {
        Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""}`,
      };
      const data = await instace.patch("/auth/logout", null, { headers });
      if (data?.data?.message == "Đăng xuất thành công") {
        Cookies.remove("datatoken")
        dispatch(setUser(null))
        dispatch(setDataToken(null))
      }
      // Rest of your code
    } catch (error) {
      console.log(error);
    }
  };

  const languageStyles = {
    language: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "rgba(167, 170, 200, 0.365)",
      borderRadius: "2px",
      margin: "0",
      height: "18px",
      width: '60px'
    },
    active: {
      border: "5px solid rgb(127, 200, 249)",
      borderRadius: "5px",
    },
    span: {
      marginLeft: '10px'
    }
  };



  return (
    <div className="w-full fixed z-[9999] bg-[#004a99f5] flex justify-center items-center py-1 px-4">
      <div className="w-[1280px]  flex justify-between items-center">
        <div className="flex justify-center items-center">
          <img src="/logo.png" alt="" className="w-[118px] cursor-pointer" onClick={()=>{nav('/')}}/>
          <h1
            className="text-base text-white opacity-80 font-medium ml-8 cursor-pointer"
          >
            <a href="/extention"> Go to Extention</a>
          </h1>
        </div>
        <div className="flex justify-center items-center ">
          {!dataToken ? <div className="text-base text-white opacity-80 font-medium">
            <button className="mr-8" onClick={handleRedirectregister}>
              Đăng ký
            </button>
            <button onClick={handleRedirectLogin}>Đăng nhập</button>
          </div> : <div className="flex text-base text-white opacity-80 font-medium ">
            {user?.role === "admin" ? <h1 className="text-[#fff] cursor-pointer" onClick={() => { nav("/admin") }}>Quản trị viên</h1> : null}
            <h1 className="text-[#fff] mx-5 cursor-pointer" onClick={() => { nav("/profile") }}>{user?.username}</h1>
            <p className="text-[#fff] mx-5 cursor-pointer">{user?.totleMoney / 1000} Bit</p>
            <button className="" onClick={handleLogout}>Đăng xuất</button>
          </div>}
          <div className="language !ml-8" style={languageStyles.language}>
            <span
              className="cursor-pointer mr-1"
              onClick={() => changeLanguage('vi')}
              style={lng === 'vi' ? { ...languageStyles.active } : {}}
            >
              <img src="/vi.png" alt="VI" style={languageStyles.img} />
            </span>
            <span
              className="cursor-pointer"
              onClick={() => changeLanguage('en')}
              style={lng === 'en' ? { ...languageStyles.active } : {}}
            >
              <img src="/en.png" alt="EN" style={languageStyles.img} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeHeader;
