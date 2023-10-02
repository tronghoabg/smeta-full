import React, { useEffect, useState } from 'react'
import instace from './customer_axios'
import RefreshToken from "./RefreshToken";
import { setDataToken, setPayFocus, setUser } from "../redux/counterSlice";
import { useDispatch, useSelector } from "react-redux";
import priceFormat from '../config/priceFormat';
import { BsCalendar2Date, BsCheck } from "react-icons/bs";
import { Radio } from 'antd';
import { HiOutlineColorSwatch } from "react-icons/hi";
import { PiMedalFill } from "react-icons/pi";


function Newpaymentpackage({ setError, setOpen, setdisable, handleCancel }) {
    useEffect(() => {
        if (setdisable) {
            setdisable(false)
        }
    }, [])
    const counter = useSelector((state) => state.counter);
    const dispatch = useDispatch()
    let { dataToken } = counter
    const [data, setdata] = useState([])


    useEffect(() => {
        instace.get('/buypackage/getallprouct')
            .then(value => {
                const data = value.data
                let uniqueProducts = data.reduce((acc, current) => {
                    const existingProduct = acc.find(item => item.product_name === current.product_name);

                    if (!existingProduct) {
                        acc.push(current);
                    }

                    return acc;
                }, []);
                uniqueProducts = uniqueProducts.reverse().map(value => {
                    let newvalue = { key: value.product_name, option: [] }
                    data.map(item => {
                        if (item.product_name === value.product_name) {
                            const newop = [...newvalue.option, item]
                            newvalue = { ...newvalue, option: newop }
                        }
                    })
                    return newvalue
                })
                let datasss = daoViTri(uniqueProducts)
                setdata(datasss)
            })
    }, [])


    function daoViTri(arr) {
        if (arr.length >= 5) {  // Đảm bảo mảng có ít nhất 5 phần tử
          [arr[2], arr[4]] = [arr[4], arr[2]]
        }
        return arr;
      }


    const buypackage = async () => {
        setError({ type: "error", error: "" })
        setOpen(true)

        if (valueOption?.length === 0) {
            return setError({ type: "error", error: "Chọn gói của bạn" })
        }
        try {
            const handlebuy = async(valueSmetaPackage)=>{
                try {
                    let data = await instace.post('/buypackage/buyer', { _id: valueSmetaPackage }, {
                        headers: {
                            Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""
                                }`,
                        },
                    })
                    if(handleCancel){
                        handleCancel()
                    }
                    setError({ type: "success", error: data.data.message })
                    dispatch(setUser(data.data.user))
                } catch (error) {
                    setError({ type: "error", error: error.response.data.message })
                }
            }
            const newDatatoken = await RefreshToken(dataToken);
            dispatch(setDataToken(newDatatoken));
            valueOption.map(value=>{
                handlebuy(value._id)
            })
            
        } catch (error) {
            setError({ type: "error", error: error.response.data.message })

            if ("Vui long nap thêm tiền" === error.response.data.message) {
                dispatch(setPayFocus(true))
            }
        }
    }
    const percent_number = process.env.PERCENT_NUMBER || 1

    const [valueTimezone, setValue] = useState(30);
    const [valueOption, setValueOption] = useState([])


    const handleChoose = (key) => {
        let datas = data.find(value => value.key === key).option.find(values => values.product_timezone === valueTimezone)
        if (key === "All") {
            return setValueOption([datas])
        }
        let clonedata = valueOption
        let check2 = valueOption.find(value => value.product_name === "All")
        if (check2) {
            clonedata = clonedata.filter(value => value.product_name !== "All")
        }
        if (clonedata.length > 0) {
            let checked = clonedata.find(value => value.product_name === key)
            if (checked) {
                let A = clonedata?.filter(value => value.product_name !== key)
                setValueOption(A)
            } else {
                setValueOption([...clonedata, datas])
            }
        } else {
            setValueOption([datas])
        }
    }

    const handleChangeMonth = (timezone) => {
        if (valueOption) {
            let newdata = valueOption.map(value => {
                data.find(item => item.key === value.product_name).option.map(values => {
                    if (values.product_timezone === timezone) {
                        value = values
                    }
                })
                return value
            })
            setValueOption(newdata)
        }
        setValue(timezone)
    }
    let curenttotal = 0
    let totalbuy = 0

    valueOption?.map(value => {
        curenttotal += value.product_price
        if( value.product_desc_discount > 0){
            totalbuy += (Number(value.product_price) * Number((100 -value.product_desc_discount)/100))
        }else{
            totalbuy = curenttotal
        }
    })

    return (
        <div className=' bg-[#f9fbfd] pb-4 shadow-lg overflow-hidden	rounded-lg flex justify-center items-start'>
            <div className='p-4 grid grid-cols-7 gap-2 w-full'>
                <div className='col-span-5 bg-[#fff] border !border-[#e2e7e7] p-2'>
                    <h1 className='text-base font-medium flex items-center '>
                        <BsCalendar2Date className='mr-4 font-bold text-xl my-8' />
                        Bạn muốn mua trong thời gian bao lâu?
                    </h1>
                    <Radio.Group className='w-full' size="large" onChange={(e) => { handleChangeMonth(e.target.value) }} value={valueTimezone}>
                        <div className='grid grid-cols-4 gap-4'>
                            {data.length > 0 ? data[0].option.map(values => {
                                return (
                                    <div key={values.product_timezone} onClick={() => { handleChangeMonth(values.product_timezone) }}
                                        className={`p-4 cursor-pointer  bg-[#c3f5d0d0] hover:scale-105 duration-300 border col-span-1  
                            ${values.product_timezone === valueTimezone ? "!border-[#478bfb]" : "!border-[#c3f5d0d0]"} flex items-center shadow-lg justify-between`}>
                                        <div key={values.product_timezone} className='' >
                                            <h3 className='text-[#12263f] font-medium mb-2 text-base'>{values.product_timezone / 30} tháng</h3>
                                            <h3 className='text-sm text-[#12263f]'> Giảm {values.product_desc_discount}% </h3>
                                        </div>
                                        <div className='rounded-full bg-[#fff] flex items-center justify-center'>
                                            <Radio size="large" className='py-0.5 px-1.5 !m-0 ' value={values.product_timezone}></Radio>
                                        </div>
                                    </div>
                                )
                            }) : null}
                        </div>

                    </Radio.Group>
                    <h1 className='text-base font-medium flex items-center '>
                        <HiOutlineColorSwatch className='mr-4 font-bold text-xl my-8' />
                        Chọn tính năng bạn muốn mua
                    </h1>
                    <div>
                        {
                            data?.map((value, index) => {
                                return (
                                    <div key={index} onClick={() => { handleChoose(value.key) }} className='flex justify-between items-center border !border-gray-300 mb-6 !rounded-lg p-3 cursor-default text-base '>
                                        <div className='flex items-center'>
                                            <div className={`w-5 h-5 flex justify-center items-center rounded-full border duration-300  ${valueOption.find(option => option.product_name === value.key) ? "bg-blue-500 !border-blue-500" : "bg-none !border-gray-400"}`} >
                                                <BsCheck className={`text-white mt-[0px] text-[24px]`} />
                                            </div>
                                            <h1 className='ml-4 font-medium'>{value.key}</h1>
                                        </div>

                                        <div>
                                            {value.option.map(values => {
                                                if (values.product_timezone === valueTimezone) {
                                                    return (
                                                        <div key={values.product_timezone}><span className={`font-medium text-base ${value.key === "All" ? "text-yellow-400" : ""}`}>{priceFormat(values.product_price / percent_number)} <i class="fa-solid fa-coins coin"></i></span>
                                                            <span className='text-[#95AAC9] italic text-sm'> /{values.product_timezone / 30} monthly</span></div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='rounded-lg bg-[#fff] col-span-2 px-8 border !border-[#e2e7e7] py-4'>
                    {valueOption.length > 0 ?
                        <div className='flex flex-col justify-center items-center'>
                            <h1 className='text-xl font-medium mb-6'>Hóa đơn</h1>
                            <div className='flex justify-between items-center w-full mb-3 text-base font-medium'>
                                <p className='text-[14px]'> {valueOption.length} <span>TÍNH NĂNG</span></p>
                                <p> {priceFormat(curenttotal / percent_number)}  <i class="fa-solid fa-coins coin"></i></p>
                            </div>

                            <div className='flex justify-between items-center mb-14 text-[14px] w-full '>
                                <p><span>Thời hạn</span></p>
                                <p> {valueOption[0].product_timezone / 30} tháng</p>
                            </div>
                            {valueOption.map(value => {
                                return (
                                    <div key={value.product_name} className='flex justify-start items-center w-full mb-3'>
                                        <p><PiMedalFill className="text-[#ff9735] text-base" /></p>
                                        <p className='ml-4 text-base font-normal'>{value.product_name}</p>
                                    </div>
                                )
                            })}

                            <div className='w-full border-t border-dashed mt-4	!border-blue-600 h-[1px]'>
                            </div>
                            <div className='flex justify-between items-center mt-4 w-full mb-3 text-base font-medium'>
                                <p><span>Tổng số tiền</span></p>
                                <p className='font-normal'> {priceFormat(curenttotal / percent_number)}  <i class="fa-solid fa-coins coin"></i></p>
                            </div>

                            <div className='flex justify-between items-center w-full mb-3 text-base font-medium'>
                                <p><span>Giảm giá</span></p>
                                <p className='font-normal'> - {priceFormat((curenttotal - totalbuy)/percent_number )} <i class="fa-solid fa-coins coin"></i></p>
                            </div>
                            <div className='w-full border-t border-dashed mt-4	!border-blue-600 h-[1px]'>
                            </div>
                            <div className='flex justify-between items-center w-full mb-[50px] mt-4 text-base font-medium'>
                                <p> <span>Tổng thanh toán</span></p>
                                <p className=''> {priceFormat(totalbuy / percent_number)}  <i class="fa-solid fa-coins coin"></i></p>
                            </div>
                            <div className='flex w-full justify-center items-center '>
                                <button onClick={buypackage} className='text-[#fff] bg-blue-400 px-6 py-2.5 hover:bg-blue-600 duration-300  rounded-lg text-base font-medium'>Thanh toán</button>
                            </div>
                        </div>
                        : <div className='overflow-hidden	'>
                            <img src="./paymentimg.png" alt="" />
                            <h1 className='text-center mt-10 font-medium text-base'>Chưa có thông tin thanh toán</h1>
                            <p className='text-center text-[#95AAC9] '>Bạn hãy chọn ít nhất một chức năng để hiển thị
                                thông tin thanh toán nhé</p>
                        </div>}
                </div>
            </div>
        </div>
    )
}

export default Newpaymentpackage