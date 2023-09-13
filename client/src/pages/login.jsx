import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import HomeHeader from '../components/home/HomeHeader';
import HomeFooter from '../components/home/HomeFooter';
import { useEffect } from "react";
import axios from "axios"
import instace from './customer_axios';
import { useSelector, useDispatch } from 'react-redux';
import { setDataToken, setUser } from '../redux/counterSlice';
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import Cookies from 'js-cookie';



const Login = ({ setdisable, setlogintoken, logintoken }) => {
    const { t } = useTranslation();
    useEffect(() => {
        setdisable(false)
    }, [])
    const nav = useNavigate()
    const counter = useSelector((state) => state.counter);
    let { dataToken } = counter
    useEffect(()=>{
        if(dataToken){
            nav('/')
        }
    },[])
    // t('login')
    // t('account')
    // t('password')
    // t('register')
  


    const dispatch = useDispatch();
    const [valueLogin, setValueLogin] = useState({ username: "", password: "" })
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);

    const handleChangeValue = (e, key) => {
        const newdata = { ...valueLogin, [`${key}`]: e.target.value }
        setValueLogin(newdata)
    }

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const handlelogin = async () => {
        setOpen(true)
        if(valueLogin.password && valueLogin.username){
            try {
                const data = await instace.post('/auth/login', valueLogin)
                dispatch(setUser(data.data.user))
                dispatch(setDataToken(data.data.token))
                Cookies.set('datatoken',JSON.stringify( data.data.token) , {expires: new Date( Date.now() + 30 * 24 * 60 * 60 * 1000)});
                nav('/')
            } catch (error) {
                console.log(error);
                setError(error.response.data.message)
            }
        }else{
            setError("Vui lòng điền đầy đủ thông tin")
        }
      
    }

    return (
        <>
            <HomeHeader />
            <div className='w-full h-screen bg-[#fff] flex justify-center items-center pt-[120px]'>
                {error.length > 0 ? (
                    <Snackbar
                        className='!z-[999999]'
                        open={open}
                        autoHideDuration={6000}
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
                <div className='w-[800px]  border_login overflow-hidden	 rounded-2xl grid grid-cols-2 '>
                    <div className='p-8'>
                        <h1 className='text-2xl text-center mb-[60px]'>Đăng nhập</h1>
                        <div>
                            <p className='text-base mb-2 '>Tên đăng nhập </p>
                            <input type="text" className='w-full p-2 placeholder:text-base' value={valueLogin.username} onChange={(e) => { handleChangeValue(e, "username") }} placeholder='Tên đăng nhập bằng SDT' />
                        </div>
                        <div>
                            <p className='text-base mb-2 mt-6 '>Mật khẩu </p>
                            <input type="password" className='w-full p-2 placeholder:text-base' value={valueLogin.password} onChange={(e) => { handleChangeValue(e, "password") }} placeholder='Password' />
                        </div>
                        <div onClick={()=>{nav("/verifypassword")}} className='text-right mt-2 cursor-pointer hover:text-blue-600 text-blue-800'>
                            Quên mật khẩu ?
                        </div>
                        <div className='flex justify-center items-center'>
                            <button className='bg-[#064262] p-2 px-4 rounded-lg text-white text-xl mt-8' onClick={handlelogin}>Đăng nhập</button>
                        </div>

                        <div className='flex justify-center items-center mt-12'>
                            <p>Bạn chưa có tài khoản?</p>
                            <button  onClick={()=>{nav("/register")}} className='border-2 ml-3 border-red-500 py-1 px-2 duration-300 hover:bg-red-500 hover:text-white text-red-500 rounded-lg text-base'>Đăng ký</button>
                        </div>
                    </div>
                    <div className='bg_login flex flex-col justify-center items-start pl-12 text-white'>
                        <p className='text-2xl mb-5'>sMeta.vn</p>
                        <p className='text-base'>Quản lý tài khoản chuyên nghiệp !</p>
                    </div>
                </div>
            </div>
            <HomeFooter />
            {/* <div className="tool-bar">
                <div className='icon'><i class="fa-solid fa-circle-user"></i></div>
                <div className='link-text'>{t('login')}</div>
            </div>
            <div className="tab-content">
                <div className='login'>
                    <div className="title">{t('login')}</div>
                    <div className="text"> {t('account')}</div>
                    <input type="text" placeholder="ID" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <div className="text"> {t('password')}</div>
                    <div className='input-password'>
                        <input type={isShowPassword === true ? "text" : "password"} placeholder={t('password')} value={password} onChange={(event) => setPassword(event.target.value)} />
                        <i className={isShowPassword === true ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"}
                            onClick={() => setShowPassword(!isShowPassword)}
                        ></i>
                    </div>
                    <div className='link'>
                        <NavLink to='/register'>{t('register')}</NavLink>
                    </div>

                    <button
                        className={email && password ? 'active' : ''}
                        disabled={email && password ? false : true}
                        onClick={() => handleLogin()}
                    >
                        {loadingApi === true ? <i className="fas fa-spinner fa-spin"></i> : ''}
                        &nbsp;{t('login')}
                    </button>
                </div>
            </div> */}
        </>
    )
}
export default Login