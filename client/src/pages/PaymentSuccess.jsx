import axios from 'axios'
import React, { useEffect, useState } from 'react'
import instace from './customer_axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setDataToken, setUser } from "../redux/counterSlice";
import RefreshToken from "./RefreshToken";

function PaymentSuccess() {
    const payosApiKey = '2c147a4d-568a-454d-afd8-bb7ea084125f';
    const orderCode = window.localStorage.getItem("sMetaOrderCode")
    const counter = useSelector((state) => state.counter);
    let { dataToken, user } = counter
    const nav = useNavigate()
    const dispatch = useDispatch()

    const [open, setOpen]= useState(false)
    useEffect(() => {
        const fetchdata = async () => {
            const newDatatoken = await RefreshToken(dataToken);
            dispatch(setDataToken(newDatatoken));
            const headers = {
                'x-client-id': 'd8aba58b-f689-406e-b3b7-ed78381c0270',
                'x-api-key': payosApiKey,
            };
            const data = await axios.get(`https://api-merchant.payos.vn/v2/payment-requests/${orderCode}`, { headers })
            if (data.data.data.status == "PAID") {
                const createPayment = await instace.post('/payment/postpayment', {
                    orderCode: orderCode,
                    createdAt: data.data.data.createdAt,
                    amount: data.data.data.amount,
                    status: data.data.data.status,
                    signature: data.data.signature,
                }, {
                    headers: {
                        Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""
                            }`,
                    },
                })
                return { createPayment, data }
            }

        }


        fetchdata().then((data) => {
            console.log(data);
            if (data?.createPayment.data.message === "Error") {
                nav('/')
            }else{
                let newuser = {...data?.createPayment.data.user, totleMoney: Number(data?.createPayment.data.user.totleMoney) + Number(data.data.data.data.amount) }
                dispatch(setUser(newuser))
                setOpen(true)
            }
        });

    }, [])

    return (
        <div className='!w-full h-screen bg-white flex justify-center items-center flex-col'>
            <img src="./paymentsuccess.png" alt="" className='w-[300px]' />

            <div>
                {open ? <p>Bạn đã nạp tiền thanh công</p> : ""}
                {open ? <button className='text-blue-600' onClick={()=>{nav("/")}}>Trở về trang chủ</button> : ""}
            </div>
        </div>
    )
}

export default PaymentSuccess