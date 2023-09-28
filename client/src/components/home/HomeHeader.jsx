import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import instace from "../../pages/customer_axios";
import { setUser, setDataToken, setPayFocus } from "../../redux/counterSlice";
import RefreshToken from "../../pages/RefreshToken";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import {  Modal } from "antd";
import { AiFillStar } from "react-icons/ai";
import priceFormat from "../../config/priceFormat";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Payment from "../../pages/payment";
import Newpaymentpackage from "../../pages/newpaymentpackage";
import { IoIosArrowDown } from "react-icons/io";
import Loading from "../Loading"

function HomeHeader({classfull}) {
  let token = Cookies.get("datatoken");
  const nav = useNavigate();
  const counter = useSelector((state) => state.counter);
  let { dataToken, user, payFocus, buyaction } = counter;
  const handleRedirectLogin = () => {
    nav("/login");
  };
  const { i18n } = useTranslation();
  const [lng, setLng] = useState("vi");
  const { t } = useTranslation();

  useEffect(() => {
    const fetch = async () => {
      try {
        if (token) {
          const newDatatoken = await RefreshToken(dataToken);
          dispatch(setDataToken(newDatatoken));

          const datauser = await instace.get("/auth/profile", {
            headers: {
              Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""
                }`,
            },
          });
          dispatch(setUser(datauser.data));
        } else {
          dispatch(setUser(null));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (buyaction) {
      setIsModalOpen(true)
    }
  }, [buyaction])

  useEffect(() => {
    if (user) {
      i18n.changeLanguage(user?.userLanguage);
      setLng(user?.userLanguage)
    }
  }, [user])

  const [loading, setLoading] = useState(false)

  const changeLanguage = async (lng) => {
    setLoading(true)
    if (dataToken) {
      const newDatatoken = await RefreshToken(dataToken);
      dispatch(setDataToken(newDatatoken));
      const headers = {
        Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""}`,
      };
       await instace.patch("/auth/updatelang", { language: lng }, { headers });
      setLoading(false)
      i18n.changeLanguage(lng);
      setLng(lng);
    } else {
      setLoading(false)
      i18n.changeLanguage(lng);
      setLng(lng);
    }


  };
  const handleRedirectregister = () => {
    nav("/register");
  };
  const dispatch = useDispatch();

  const handleLogout = async () => {
    // Cookies.remove("datatoken");
    // dispatch(setUser(null));
    // dispatch(setDataToken(null));
    try {
      const newDatatoken = await RefreshToken(dataToken);
      dispatch(setDataToken(newDatatoken));
      const headers = {
        Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""}`,
      };
      const data = await instace.patch("/auth/logout", null, { headers });
      if (data?.data?.message === "Đăng xuất thành công") {
        Cookies.remove("datatoken");
        dispatch(setUser(null));
        dispatch(setDataToken(null));
        window.location.href = "/";

      }
      // Rest of your code
    } catch (error) {
      Cookies.remove("datatoken");
      dispatch(setUser(null));
      dispatch(setDataToken(null));
      window.location.href = "/";
    }
  };


 
  // const percent_number = process.env.PERCENT_NUMBER || 1;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);

  const showModal = () => {
    setIsModalOpen1(false);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [error, setError] = useState({ type: "error", error: "" });
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const datalang = [
    { value: "vi", name: "Tiếng viêt", img: "./vi.png" },
    { value: "en", name: "English", img: "./en.png" },
  ]

  const [dropvalue, setDropvalue] = useState(false)
  return (
    <div className="w-full fixed z-[999999] bg-[#004a99f5] flex justify-center items-center py-1 px-4">
      {loading ? <Loading /> : null}
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={null}
        width={990}
        closable={false}
      >
        <h1 className="text-2xl relative font-medium text-center p-4 text-yellow-400">
          {/* Update plan
          <span onClick={handleCancel} className="!absolute right-[16px] cursor-pointer top-[16px] text-blue-500 text-sm px-2 py-1 rounded-md hover:scale-110 duration-300 font-normal bg-slate-200">Skip for now</span> */}
        </h1>
        {/* <ProductPackage cla="!gap-2" setError={setError} center_btn="flex w-full justify-center items-center" setOpen={setOpen} /> */}
        <Newpaymentpackage handleCancel={handleCancel} setError={setError} setOpen={setOpen} />
      </Modal>

      <Modal
        open={isModalOpen1}
        onCancel={() => { setIsModalOpen1(false) }}
        centered
        footer={null}
        width={990}
        closable={false}
      >
        <div className="bg-[#fff] rounded-xl shadow-lg shadow-[#1d1c1c]">
          <Payment setError={setError} />
        </div>
      </Modal>
      {error.error?.length > 0 ? (
        <Snackbar
          className="!z-[9999999]"
          open={open}
          autoHideDuration={1000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Alert
            onClose={handleClose}
            severity={error.type}
            sx={{ width: "100%" }}
          >
            {error.error}
          </Alert>
        </Snackbar>
      ) : (
        <p>{null}</p>
      )}
      <div className={`w-[1280px] duration-300  ${classfull} flex justify-between items-center`}>
        <div className="flex justify-center items-center">
          <img
            src="/logo.png"
            alt=""
            className="w-[118px] cursor-pointer"
            onClick={() => {
              nav("/");
            }}
          />
          <h1 className="text-base text-white opacity-80 font-medium ml-8 cursor-pointer">
            <a href="/extention"> Go to Extention</a>
          </h1>
          {dataToken ? <button
            className="text-base text-[#fffc53] opacity-80 font-medium ml-8 cursor-pointer relative hover:text-[rgb(124,255,130)]"
            onClick={showModal}
          >
            {t("Upgrade your account")}
            <span className="!absolute text-[#fffc53] !-top-[1px] !-right-[13px] ">
              <AiFillStar />
            </span>
          </button> : null}
        </div>
        <div className="flex justify-center items-center ">
          {!dataToken ? (
            <div className="text-base text-white opacity-80 font-medium">
              <button className="mr-8" onClick={handleRedirectregister}>
                {t("register")}
              </button>
              <button onClick={handleRedirectLogin}>{t("login")}</button>
            </div>
          ) : (
            <div className="flex text-base text-white opacity-80 font-medium ">
              {user?.role === "admin" ? (
                <h1
                  className="text-[#fff] cursor-pointer"
                  onClick={() => {
                    nav("/admin");
                  }}
                >
                  {t("admin")}
                </h1>
              ) : null}
              <h1
                className="text-[#fff] mx-5 cursor-pointer"
                onClick={() => {
                  nav("/profile");
                }}
              >
                {user?.username}
              </h1>
              <p onClick={() => {
                dispatch(setPayFocus(false))
                setIsModalOpen1(true)
                setIsModalOpen(false)
              }} className={`text-[#56ff47] mx-5 cursor-pointer ${payFocus ? "payFocus_animation" : ""}`}>
                {priceFormat(user?.totleMoney)} C
              </p>
              <button className="" onClick={handleLogout}>
                {t("logout")}
              </button>
            </div>
          )}
          <div onClick={() => { setDropvalue(!dropvalue) }} className="text-[#fff] flex items-center justify-center ml-8 relative group/item  p-2 cursor-pointer">
            <img className="rounded-full w-4 h-4 mr-2 mt-0.5" src={`./${lng}.png`} alt="" />
            <p className="mr-3 text-base">{lng?.toLocaleUpperCase()}</p>
            <IoIosArrowDown />
            <div className={`w-[180px] px-4 py-1 bg-[#fff] ${dropvalue ? "!opacity-100" : "!opacity-0"}  duration-300  !absolute top-[40px] -right-[18px] rounded-lg shadow-lg`}>
              {datalang.map(value => {
                return (
                  <div key={value.value} onClick={() => {
                    // setDropvalue(false)
                    changeLanguage(value.value)
                  }} className="flex items-center text-[#000] my-3 hover:text-blue-400">
                    <img className="rounded-full w-4 h-4" src={value.img} alt="" />
                    <p className="text-base ml-4" >{value.name}</p>
                  </div>
                )
              })}
            </div>
          </div>
          {/* <div className="language !ml-8" style={languageStyles.userLanguage}>
            <span
              className="cursor-pointer mr-1"
              onClick={() => changeLanguage("vi")}
              style={lng === "vi" ? { ...userLanguageStyles.active } : {}}
            >
              <img src="/vi.png" alt="VI" style={languageStyles.img} />
            </span>
            <span
              className="cursor-pointer"
              onClick={() => changeLanguage("en")}
              style={lng === "en" ? { ...userLanguageStyles.active } : {}}
            >
              <img src="/en.png" alt="EN" style={languageStyles.img} />
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default HomeHeader;
