import React, { useEffect, useState } from 'react'
import HomeHeader from '../components/home/HomeHeader'
import HomeFooter from '../components/home/HomeFooter'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import ConfirmEmail from '../components/ConfirmEmail'
import Loading from "../components/Loading"

function Verifypassword({ setdisable }) {
    useEffect(() => {
        setdisable(false)
    }, [])

    const nav = useNavigate()

    const [valueVerify, setValueVerify] = useState({ email: "", username: "" })
    const [confirmEmail, setConfirmEmail] = useState(false)
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setloading] = useState(false);


    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const handleChangeValue = (e, key) => {
        const newdata = { ...valueVerify, [`${key}`]: e.target.value }
        setValueVerify(newdata)
    }

    const handleSendEmail = async () => {
        setloading(true)
        setOpen(true)
        if (valueVerify.email && valueVerify.username) {
            try {
                const data = await axios.post("http://localhost:5000/pass/sendcode", { email: valueVerify.email, username: valueVerify.username })
                console.log(data);
                if (data) {
                    setloading(false)
                    setConfirmEmail(!confirmEmail)
                }
            } catch (error) {
                setloading(false)
                setError(error.response.data)
            }
        } else {
            setloading(false)
            setError("Điền đẩy đủ thông tin")
        }
    }

    return (
        <div >
            {loading ? <Loading loadingoption=" !w-full mt-[120px] !h-screen" /> : null}

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
            <HomeHeader />
            { confirmEmail ? 
            <ConfirmEmail setloading={setloading} setError={setError} setOpen={setOpen} valueVerify={valueVerify} /> :
                <div className='w-full pt-[100px] flex justify-start flex-col items-center h-screen bg-[#fff]'>
                    <img src="/logo.png" alt="" className='w-[160px]' />

                    <h1 className='text-[30px] font-medium text-center my-4 tracking-[0.5px]'>Quên mật khẩu</h1>
                    <p className='mb-8 tracking-[0.5px]'>Nhập email của bạn để nhận mã xác thực lấy lại mật khẩu</p>
                    <div>
                        <div>
                            {/* <p className='text-base mb-2 '>Email: </p> */}
                            <input type="email" className='w-full min-w-[380px] focus:border-1 focus:border-blue-800 mb-2 p-2 placeholder:text-base' value={valueVerify.email} onChange={(e) => { handleChangeValue(e, "email") }} placeholder='Your Email' />
                        </div>
                        <div>
                            {/* <p className='text-base mb-2 mt-6 '>Username</p> */}
                            <input type="text" className='w-full min-w-[380px] focus:border-1 focus:border-blue-800 mb-2 p-2 placeholder:text-base' value={valueVerify.username} onChange={(e) => { handleChangeValue(e, "username") }} placeholder='Tên đăng nhập' />
                        </div>
                    </div>
                    <button onClick={handleSendEmail} className='text-base text-white bg-blue-800 rounded-3xl mt-6  hover:bg-blue-600 px-[130px] py-2'>Lấy lại mật khẩu</button>
                    <p onClick={() => { nav('/login') }} className='mt-2 text-blue-800 text-md cursor-pointer hover:text-blue-600 p-2'>Quay lại đăng nhập</p>
                </div>}


            <HomeFooter />
        </div>
    )
}

export default Verifypassword