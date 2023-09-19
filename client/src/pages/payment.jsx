import React, { useState } from 'react'
import axios from 'axios';
import CryptoJS from 'crypto-js';
import getOrdercode from '../config/getOrdercode';
import { useDispatch, useSelector } from "react-redux";


function Payment() {
  const counter = useSelector((state) => state.counter);
  let { dataToken, user } = counter
  const paymentGatewayUrl = 'https://api-merchant.payos.vn/v2/payment-requests';
  const payosApiKey = '2c147a4d-568a-454d-afd8-bb7ea084125f';
  const checksumKey = '1fdf589537cd65762241d2163a631d7f8f8ad6ad54bd01ad24f0d05122d53fe7';
  const [orderInfo, setOrderInfo] = useState({
    orderCode: 8,
    amount: null,
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
    cancelUrl: 'http://localhost:3000',
    returnUrl: 'http://localhost:3000/paymentsuccess',
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

    axios
      .post(paymentGatewayUrl, { ...orderInfo, signature, orderCode: newOrdercode }, { headers })
      .then((response) => {
        if (response.data.desc == "success") {
          const paymentLink = response.data.data.checkoutUrl;
          window.location.href = paymentLink
        } else {
          console.error('Phản hồi từ API không chứa thông tin về payment_url');
        }
        console.log(response, 'response')
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

  const SmetaPackage = [
    { name: "Share pixel", value: 1000 },
    { name: "All", value: 1000 },

  ]

const percent_number = process.env.PERCENT_NUMBER ||100
  return (
    <div className='p-4'>
      <p>Nhập số tiền:</p>
      <input type="number" placeholder='Số tiền' className='py-2 w-[200px] text-xl mb-6' value={orderInfo.amount} onChange={(e) => { setOrderInfo({ ...orderInfo, amount: e.target.value * 1 }) }} />

      <div className='grid grid-cols-5 w-full gap-4'>
        {dataCard.map(value => {
          return (
            <div onClick={() => { setOrderInfo({ ...orderInfo, amount: value.value }) }} className={`border-2 rounded-lg ${orderInfo.amount == value.value ? "border-2 !border-[#ff8b8b] scale-110 !shadow-lg" : "!border-[#f0f0f0]"} hover:shadow-lg overflow-hidden duration-500  text-start shadow-sm cursor-pointer`}>
              <h1 className='text-xl px-4 py-2 font-medium border-b !border-[#f0f0f0] bg-[#0a519d] text-white'>{value.name}</h1>
              <p className=' px-4 pb-2  pt-4'> {value.value / Number(percent_number)} Bit</p>
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


      <button className='px-4 py-2 border !border-[#e0e0e0] text-xl !rounded-md mt-6 hover:!border-[#0a519d] duration-300 cursor-pointer' onClick={sendPaymentRequest}> Thanh Toán</button>
      {/* <button className='border-2 p-4' onClick={test}>test</button> */}
      {/* {paymentLink && (
        <div>
          <p>Link thanh toán:</p>
          <a href={paymentLink} target="_blank" rel="noopener noreferrer">
            {paymentLink}
          </a>
        </div>
      )} */}
    </div>
  );
}

export default Payment