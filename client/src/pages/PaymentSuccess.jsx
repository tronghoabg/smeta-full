import axios from 'axios'
import React, { useEffect, useState } from 'react'
import instace from './customer_axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setDataToken, setUser } from "../redux/counterSlice";
import RefreshToken from "./RefreshToken";
import priceFormat from '../config/priceFormat';

function PaymentSuccess() {
    const payosApiKey = '2c147a4d-568a-454d-afd8-bb7ea084125f';
    const orderCode = window.localStorage.getItem("sMetaOrderCode")
    const counter = useSelector((state) => state.counter);
    let { dataToken} = counter
    const nav = useNavigate()
    const dispatch = useDispatch()
    const [price, setPrice] = useState(0)
    const [open, setOpen]= useState(true)
    useEffect(() => {
        const fetchdata = async () => {
            const newDatatoken = await RefreshToken(dataToken);
            dispatch(setDataToken(newDatatoken));
            const headers = {
                'x-client-id': 'd8aba58b-f689-406e-b3b7-ed78381c0270',
                'x-api-key': payosApiKey,
            };
            const data = await axios.get(`https://api-merchant.payos.vn/v2/payment-requests/${orderCode}`, { headers })
            if (data.data.data.status === "PAID") {
                const createPayment = await instace.post('/payment/postpayment', {
                    orderCode: orderCode,
                    createdAt: data.data.data.createdAt,
                    amount: data.data.data.amount/1000,
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
            if(!data){
              return  nav('/')
            }
            if (data?.createPayment.data.message === "Error") {
                return  nav('/')
            }else{
                setPrice(data.data.data.data.amount)
                let newuser = {...data?.createPayment?.data.user, totleMoney: Number(data?.createPayment?.data.user.totleMoney) + Number(data.data.data.data.amount) }
                dispatch(setUser(newuser))
                setOpen(true)
            }
        });

    }, [])

    return (
        <div className='!w-full h-screen bg-white flex justify-center items-center flex-col'>
            <img src="./paymentsuccess.png" alt="" className='w-[300px]' />
            <p className='text-4xl font-medium text-green-500 mt-12 mb-4'>{priceFormat(Number(price))} vnđ</p>

            <div>
                {open ? <p className='text-xl'>Bạn đã nạp tiền thành công</p> : ""}
                {open ? <button className='text-blue-600 text-center w-full text-base mt-2' onClick={()=>{nav("/")}}>Trở về trang chủ</button> : ""}
            </div>
        </div>
    )
}

export default PaymentSuccess