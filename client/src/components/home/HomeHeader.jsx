import React from "react";
import { Link, useNavigate, useRoutes } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import instace from "../../pages/customer_axios";
import { setUser, setDataToken } from "../../redux/counterSlice";
import RefreshToken from "../../pages/RefreshToken";
import Cookies from "js-cookie";



function HomeHeader() {
  const nav = useNavigate();
  const counter = useSelector((state) => state.counter);
  let { dataToken, user } = counter
  const handleRedirectLogin = () => {
    nav("/login");
  };
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

  console.log(user);

  return (
    <div className="w-full fixed z-[9999] bg-[#004a99f5] flex justify-center items-center py-1 px-4">
      <div className="w-[1280px]  flex justify-between items-center">
        <div className="flex justify-center items-center">
          <img src="/logo.png" alt="" className="w-[118px]" />
          <h1
            className="text-base text-white opacity-80 font-medium ml-8 cursor-pointer"
          >
            <a href="/extention"> Go to Extention</a>
          </h1>
        </div>
        {!dataToken ? <div className="text-base text-white opacity-80 font-medium">
          <button className="mr-8" onClick={handleRedirectregister}>
            Đăng ký
          </button>
          <button onClick={handleRedirectLogin}>Đăng nhập</button>
        </div> : <div className="flex text-base text-white opacity-80 font-medium ">
          {user?.role === "admin" ? <h1 className="text-[#fff] cursor-pointer" onClick={()=>{nav("/admin")}}>Quản trị viên</h1> : null}
          <h1 className="text-[#fff] mx-5 cursor-pointer"  onClick={()=>{nav("/profile")}}>{user?.username}</h1>
          <button className="" onClick={handleLogout}>Đăng xuất</button>
        </div>}

      </div>
    </div>
  );
}

export default HomeHeader;
