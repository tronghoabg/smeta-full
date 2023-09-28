import React, { useState } from 'react'
import CryptoJS from 'crypto-js';
import getOrdercode from '../config/getOrdercode';
import {  useSelector } from "react-redux";
import instace from './customer_axios';
import { useTranslation } from "react-i18next";
import priceFormat from "../config/priceFormat"
import { BsArrowLeftRight } from "react-icons/bs";


function Payment({ setError }) {
  const counter = useSelector((state) => state.counter);
  const { t } = useTranslation();

  let { dataToken, user } = counter
  const paymentGatewayUrl = 'https://api-merchant.payos.vn/v2/payment-requests';
  const payosApiKey = '2c147a4d-568a-454d-afd8-bb7ea084125f';
  const checksumKey = '1fdf589537cd65762241d2163a631d7f8f8ad6ad54bd01ad24f0d05122d53fe7';
  const [orderInfo, setOrderInfo] = useState({
    orderCode: 8,
    amount: "",
    description: 'Payment for order #1231231',
    //   buyerName: 'Nguyen Van A',
    //   buyerEmail: 'buyer-email@gmail.com',
    //   buyerPhone: '0967671182',
    //   buyerAddress: 'số nhà, đường, phường, tỉnh hoặc thành phố',
    //   items: [
    //     {
    //       name: 'Iphone',
    //       quantity: 2,
    //       price: 500000,
    //     },
    //   ],
    cancelUrl: 'https://havensavvy.com',
    returnUrl: 'https://havensavvy.com/paymentsuccess',
    //   signature: '',
  });

  const sendPaymentRequest = () => {
    const newOrdercode = getOrdercode(user.email)
    window.localStorage.setItem("sMetaOrderCode", newOrdercode)

    const signature = isValidData({ ...orderInfo, orderCode: newOrdercode });
    setOrderInfo({ ...orderInfo, signature });

    const headers = {
      'x-client-id': 'd8aba58b-f689-406e-b3b7-ed78381c0270',
      'x-api-key': payosApiKey,
    };

    instace
      .post(paymentGatewayUrl, { ...orderInfo, signature, orderCode: newOrdercode }, { headers })
      .then((response) => {
        if (response.data.desc === "success") {
          const paymentLink = response.data.data.checkoutUrl;
          window.location.href = paymentLink
        } else {
          console.error('Phản hồi từ API không chứa thông tin về payment_url');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };


  function sortObjDataByAlphabet(obj) {
    const sortedKeys = Object.keys(obj).sort();
    const sortedObject = {};

    sortedKeys.forEach((key) => {
      sortedObject[key] = obj[key];
    });
    return sortedObject;
  }

  function isValidData(data) {
    const sortData = sortObjDataByAlphabet(data);
    const stringifyData = Object.keys(sortData)
      .map((key) => `${key}=${data[key]}`)
      .join('&');
    return CryptoJS.HmacSHA256(stringifyData, checksumKey).toString(CryptoJS.enc.Hex);
  }


  const dataCard = [
    { name: "10,000 đ", value: 10000 },
    { name: "100,000 đ", value: 100000 },
    { name: "150,000 đ", value: 150000 },
    { name: "200,000 đ", value: 200000 },
    { name: "250,000 đ", value: 250000 },
    { name: "300,000 đ", value: 300000 },
    { name: "350,000 đ", value: 350000 },
    { name: "500,000 đ", value: 500000 },
  ]

  const percent_number = process.env.PERCENT_NUMBER || 1000
  return (
    <div className='p-4'>
      <p>{t('Nhập số tiền:')}</p>
     <div className='flex items-center mb-6'>
     <input type="number" placeholder={t('Số tiền')} className='py-2 w-[200px] text-xl ' 
      value={orderInfo.amount}
        onChange={(e) => {
          if (e.target.value >= 0) {
            setOrderInfo({ ...orderInfo, amount: e.target.value * 1 })
          }
        }} />
      <BsArrowLeftRight className='ml-[40px] text-xl'/>
        <div className='ml-[40px] text-xl font-medium'>{priceFormat(orderInfo.amount/percent_number)} c</div>

     </div>
      <div className='grid grid-cols-5 w-full gap-4'>
        {dataCard.map((value,index) => {
          return (
            <div key={index} onClick={() => { setOrderInfo({ ...orderInfo, amount: value.value }) }} className={`border-2 rounded-lg ${orderInfo.amount == value.value ? "border-2 !border-[#ff8b8b] scale-110 !shadow-lg" : "!border-[#f0f0f0]"} hover:shadow-lg overflow-hidden duration-500  text-start shadow-sm cursor-pointer`}>
              <h1 className='text-xl px-4 py-2 font-medium border-b !border-[#f0f0f0] bg-[#0a519d] text-white'>{value.name}</h1>
              <p className=' px-4 pb-2  pt-4'> {priceFormat(value.value / Number(percent_number))} C</p>
            </div>
          )
        })}

      </div>

      <div className='grid grid-cols-5 w-full gap-4 mt-12'>
        {/* {SmetaPackage.map(value => {
          return (
            <div onClick={() => { setvalueSmetaPackage(value) }} className={`border-2 rounded-lg ${valueSmetaPackage.name == value.name ? "border-2 !border-[#ff8b8b] scale-110 !shadow-lg" : "!border-[#f0f0f0]"} hover:shadow-lg overflow-hidden duration-500  text-start shadow-sm cursor-pointer`}>
              <h1 className='text-xl px-4 py-2 font-medium border-b !border-[#f0f0f0] bg-[#0a519d] text-white'>{value.name}</h1>
              <p className=' px-4 pb-2  pt-4'> {value.value / 1000} Bit</p>
            </div>
          )
        })} */}
      </div>


      <button className='px-4 py-2 hover:scale-110 border text-xl !border-[#0a199d] !rounded-md mt-6 hover:!border-[#0a519d] duration-300 cursor-pointer' onClick={sendPaymentRequest}>{t('Thanh toán')}</button>
    </div>
  );
}

export default Payment