import React from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BsFillMoonFill, BsSun } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setdarkmode } from "../../redux/counterSlice";
import { Dropdown, Space } from "antd";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import instace from "../../pages/customer_axios";
import { setUser, setDataToken } from "../../redux/counterSlice";
import RefreshToken from "../../pages/RefreshToken";
import { useNavigate } from "react-router-dom";


const Header = (props) => {
const { t } = useTranslation();

  const counter = useSelector((state) => state.counter);
  const { darkmode, dataToken, user } = counter;
  const dispatch = useDispatch();
  const nav = useNavigate()
  const handleLogout = async () => {
    try {
      const newDatatoken = await RefreshToken(dataToken);
      dispatch(setDataToken(newDatatoken));
      const headers = {
        Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""}`,
      };
      const data = await instace.patch("/auth/logout", null, { headers });
      if (data?.data?.message == "Đăng xuất thành công") {
        Cookies.remove("datatoken");
        dispatch(setUser(null));
        dispatch(setDataToken(null));
        nav("/login")
      }
      // Rest of your code
    } catch (error) {
      console.log(error);
    }
  };
  const items = [
    {
      label: <div className="text-red-500 font-medium" onClick={handleLogout}>{t('logout')}</div>,
      key: "0",
    },
  ];

  return (
    <div className="w-full relative">
      <div className="flex justify-end items-center absolute top-0 right-0">
        <div
          onClick={() => {
            dispatch(setdarkmode(!darkmode));
          }}
        >
          {darkmode ? (
            <BsFillMoonFill className={`mx-2 text-[#4CCEAC] cursor-pointer`} />
          ) : (
            <BsSun className="mx-2 cursor-pointer" />
          )}{" "}
        </div>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Space>
              <AiOutlineSetting
                className={`mx-2 mt-1.5 cursor-pointer ${
                  darkmode ? "text-white" : ""
                }`}
              />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
