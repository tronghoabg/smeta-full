import { useTranslation } from "react-i18next";
import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import HomeHeader from "../components/home/HomeHeader";
import HomeFooter from "../components/home/HomeFooter";
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import instace from "./customer_axios";
import validateEmail from "../config/validateEmail"
import validatePhoneNumber from "../config/validataPhone"
import validateUsername from "../config/validateUsername"
import validatePass from "../config/validatePass"


const Login = ({ setdisable }) => {
    const nav = useNavigate()
    useEffect(() => {
        setdisable(false)
    }, [])

    useEffect(() => {
        if (dataToken) {
            nav('/')
        }
    }, [])
    const { t } = useTranslation();
    const counter = useSelector((state) => state.counter);
    let { dataToken } = counter

    // t('account')
    // t('password')
    // t('register')
    const [valueRegister, setValueRegister] = useState({ email: "", username: "", password: "", phone: "", language: "vi", re_password:"" })
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);

    const handleChangeValue = (e, key) => {
        const newdata = { ...valueRegister, [`${key}`]: e.target.value }
        setValueRegister(newdata)
    }

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const handleRegister = async () => {
        setOpen(true)
        setError('')
        if(valueRegister.re_password !== valueRegister.password){
            return setError("Mật khẩu chưa khớp")
        }
        if (valueRegister.email && valueRegister.phone && valueRegister.password && valueRegister.username) {
            if (validateEmail(valueRegister.email)) {
                if (!validatePhoneNumber(valueRegister.phone)) {
                    setError("Sai định dạng SDT")
                } else {
                    if (validateUsername(valueRegister.username)) {
                        if (validatePass(valueRegister.password)) {
                            try {
                                const data = await instace.post('/auth/register', valueRegister)
                                if (data.data?.message === "Đăng ký thành công") {
                                    nav("/login")
                                }
                            } catch (error) {
                                setError(error.response.data.message)
                            }
                        } else {
                            setError("Password lớn hơn 6 ki tự: chữ, số, kí tự đặc biệt")
                        }

                    } else {
                        setError("Username từ 6 đến 24 ki tự: chữ, số")
                    }

                }

            } else {
                setError("Sai định dạng email")
            }
        } else {
            setError("Vui lòng điền đầy đủ thông tin")
        }
    }
    return (
        <>

            <HomeHeader />
            <div className='w-full h-fit pb-[100px] bg-[#fff] flex justify-center items-center pt-[120px]'>
                {error.length > 0 ? (
                    <Snackbar
                        className='!z-[9999999]'
                        open={open}
                        autoHideDuration={1000}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    >
                        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
                            {error}
                        </Alert>
                    </Snackbar>
                ) : (
                    <p>{null}</p>
                )}
                <div className='min-w-[900px]  border_login overflow-hidden	 rounded-2xl grid grid-cols-2 '>
                    <div className='p-8'>
                        <h1 className='text-2xl text-center mb-[60px]'>{t('register')}</h1>
                        <div>
                            <p className='text-base mb-2 '>Email: </p>
                            <input type="email" className='w-full p-2 placeholder:text-base' value={valueRegister.email} onChange={(e) => { handleChangeValue(e, "email") }} placeholder='Your Email' />
                        </div>
                        <div>
                            <p className='text-base mb-2 mt-6 '>Số điện thoại: </p>
                            <input type="number" className='w-full p-2 placeholder:text-base' value={valueRegister.phone} onChange={(e) => { handleChangeValue(e, "phone") }} placeholder='Your Phone number' />
                        </div>
                        <div>
                            <p className='text-base mb-2 mt-6 '>{t('account')} </p>
                            <input type="text" className='w-full p-2 placeholder:text-base' value={valueRegister.username} onChange={(e) => { handleChangeValue(e, "username") }} placeholder='Your Username' />
                        </div>
                        <div>
                            <p className='text-base mb-2 mt-6 '>{t('password')}: </p>
                            <input type="password" className='w-full p-2 placeholder:text-base' value={valueRegister.password} onChange={(e) => { handleChangeValue(e, "password") }} placeholder='Password' />
                        </div>
                        <div>
                            <p className='text-base mb-2 mt-6 '>{'Nhập lại mật khẩu'}: </p>
                            <input type="password" className='w-full p-2 placeholder:text-base' value={valueRegister.re_password} onChange={(e) => { handleChangeValue(e, "re_password") }} placeholder='Re-pasword' />
                        </div>
                        {/* <div className="flex items-center mb-2 mt-6">
                            <p className='text-base  '>Ngôn ngữ:</p>
                            <div className="flex ">
                                <div className="language !ml-8" style={languageStyles.language}>
                                    <span
                                        className="cursor-pointer mr-1"
                                        onClick={() => { setValueRegister({ ...valueRegister, language: 'vi' }) }}
                                        style={valueRegister.language === "vi" ? { ...languageStyles.active } : {}}
                                    >
                                        <img src="/vi.png" alt="VI" style={languageStyles.img} />
                                    </span>
                                    <span
                                        className="cursor-pointer"
                                        onClick={() => { setValueRegister({ ...valueRegister, language: "en" }) }}
                                        style={valueRegister.language === "en" ? { ...languageStyles.active } : {}}
                                    >
                                        <img src="/en.png" alt="EN" style={languageStyles.img} />
                                    </span>
                                </div>
                            </div>
                        </div> */}
                        <div className='flex justify-center items-center'>
                            <button className='bg-[#064262] p-2 px-4 rounded-lg text-white text-xl mt-8' onClick={handleRegister}>Đăng ký</button>
                        </div>

                        <div className='flex justify-center items-center mt-12'>
                            <p>Bạn đã có tài khoản?</p>
                            <button onClick={() => { nav("/login") }} className='border-2 ml-3 border-red-500 py-1 px-2 duration-300 hover:bg-red-500 hover:text-white text-red-500 rounded-lg text-base'>Đăng nhập</button>
                        </div>
                    </div>
                    {/* <div className="bg-red-500 text-3xl" onClick={handleasdasd}>
                        test
                    </div> */}
                    <div className='bg_login flex flex-col justify-center items-start pl-12 text-white'>
                        <p className='text-2xl mb-5'>sMeta.vn</p>
                        <p className='text-base'>Quản lý tài khoản chuyên nghiệp !</p>
                    </div>
                </div>
            </div>
            <HomeFooter />
        </>
    );
};
export default Login;
