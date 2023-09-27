import React, { useState } from 'react'
// import axios from 'axios'
import { message } from 'antd'
import instace from '../pages/customer_axios'
import { useNavigate } from 'react-router-dom'

function ConfirmEmail({ valueVerify, setOpen, setloading, setError }) {
    const [code, setCode] = useState("")
    const [updatePassWord, setUpdatePassWord] = useState(false)
    const [newPassword, setNewPassword] = useState({ password: null, repassword: null })
    const [pass, setPass] = useState(null)
    const nav = useNavigate()

    const handleChangeValue = (e) => {
        setCode(e.target.value)
    }

    const handleConfirm = async () => {
        setError("")
        setloading(true)
        setOpen(true)
        try {
            const data = await instace.post("/pass/passwordretrieval", { username: valueVerify.username, code: code })
            if (data) {
                setPass(data.data.pass)
                setloading(false)
                setUpdatePassWord(true)
                setError("thanh cong")
            }
        } catch (error) {
            setloading(false)
            setError(error.response.data.error)
        }
    }

    const handleRefCodeEmail = async () => {
        setError("")
        setloading(true)
        setOpen(true)
        try {
            const data = await instace.post("/pass/sendcode", { email: valueVerify.email, username: valueVerify.username })
            if (data) {
                const newdata = { ...newPassword, password: ""}
                setNewPassword(newdata)
                setloading(false)
            }
        } catch (error) {
            setloading(false)
            setError(error.response.data)
        }
    }


    const handleChangeValuePassword = (e, key) => {
        const newdata = { ...newPassword, [`${key}`]: e.target.value }
        setNewPassword(newdata)
    }

    const handleUpdatePassword = async () => {
        setOpen(true)
        if (newPassword.password && newPassword.repassword) {
            if (newPassword.password === newPassword.repassword) {
                try {
                    const data = await instace.post("/pass/updatepassword", {
                        username: valueVerify.username,
                        pass: pass,
                        newpassword: newPassword.password
                    })
                    nav("/login")
                } catch (error) {
                    setError(error.response.data.message)
                }
            } else {
                setError("Mật khẩu chưa khớp")
            }
        } else {
            setError("Vui Lòng điền đầy đủ thông tin")
        }
    }

    return (
        <>
            <div className='w-full h-screen bg-[#fff] flex flex-col justify-start items-center pt-[100px]'>
                <img src="/logo.png" alt="" className='w-[160px]' />
                {!updatePassWord ? <>
                    <h1 className='text-[30px] font-medium text-center my-4 tracking-[0.1px]'>Nhập mã xác nhận</h1>
                    <h1 className='text-md  text-center my-4 tracking-[0.1px]'>Mã xác nhận đã được gửi đến email <span className='font-bold'>{valueVerify.email}</span> <br /> bạn vui lòng kiểm tra tin nhắn và nhập vào ô dưới đây</h1>
                    <div>
                        <input type="email" className=' min-w-[380px] focus:border-1 focus:border-blue-800 mb-1 p-2 placeholder:text-base' value={code}
                            onChange={(e) => { handleChangeValue(e) }} placeholder='Mã xác nhận' />
                    </div>
                    <div className=' min-w-[380px]'>
                        <p onClick={handleRefCodeEmail} className='text-right  text-blue-800 hover:text-blue-600 cursor-pointer py-2'>Gủi lại mã xác nhận</p>
                    </div>
                    <button onClick={handleConfirm} className='text-base text-white bg-blue-800 rounded-md mt-2  hover:bg-blue-600 px-[156px] py-2'>Xác nhận</button>
                </> : <>
                    <h1 className='text-[30px] font-medium text-center my-4 tracking-[0.1px]'>Xác minh thành công</h1>
                    <h1 className='text-md  text-center my-4 tracking-[0.1px]'>Vui lòng tạo mật khẩu mới</h1>
                    <div>
                        <input type="email" className=' min-w-[380px] mb-2 focus:border-1 focus:border-blue-800 p-2 placeholder:text-base' value={newPassword.password}
                            onChange={(e) => { handleChangeValuePassword(e, "password") }} placeholder='Mật khẩu mới' />
                    </div>
                    <div>
                        <input type="email" className=' min-w-[380px] focus:border-1 focus:border-blue-800 mb-1 p-2 placeholder:text-base' value={newPassword.repassword}
                            onChange={(e) => { handleChangeValuePassword(e, "repassword") }} placeholder='Xác nhận mật khẩu' />
                    </div>
                    <button onClick={handleUpdatePassword} className='text-base text-white bg-blue-800 rounded-md mt-2  hover:bg-blue-600 px-[156px] py-2'>Xác nhận</button>

                </>}
            </div>
        </>

    )
}

export default ConfirmEmail