import React, { useEffect, useState } from 'react'
import instace from './customer_axios'
import RefreshToken from "./RefreshToken";
import { setDataToken, setUser } from "../redux/counterSlice";
import { useDispatch, useSelector } from "react-redux";
import priceFormat from '../config/priceFormat';

function ProductPackage({ setError, setOpen, cla }) {
    const counter = useSelector((state) => state.counter);
    let { dataToken, user } = counter
    const [data, setdata] = useState([])
    const [valueSmetaPackage, setvalueSmetaPackage] = useState()
    const dispatch = useDispatch()
    useEffect(() => {
        instace.get('/buypackage/getallprouct')
            .then(value => {
                const data = value.data
                // const productName = data.filter((item, index) => data.indexOf(item.product_name) === index)
                // console.log(productName);
                let uniqueProducts = data.reduce((acc, current) => {
                    const existingProduct = acc.find(item => item.product_name === current.product_name);

                    if (!existingProduct) {
                        acc.push(current);
                    }

                    return acc;
                }, []);
                uniqueProducts = uniqueProducts.map(value => {
                    let newvalue = { key: value.product_name, option: [] }
                    data.map(item => {
                        if (item.product_name === value.product_name) {
                            const newop = [...newvalue.option, item]
                            newvalue = { ...newvalue, option: newop }
                        }
                    })
                    return newvalue
                })
                setdata(uniqueProducts)
            })

    }, [])

    const buypackage = async () => {
        if (!valueSmetaPackage) {
            return setError({ type: "error", error: "Chọn gói của bạn" })
        }
        setOpen(true)
        try {
            const newDatatoken = await RefreshToken(dataToken);
            dispatch(setDataToken(newDatatoken));
            const data = await instace.post('/buypackage/buyer', { _id: valueSmetaPackage }, {
                headers: {
                    Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""
                        }`,
                },
            })
            setError({ type: "success", error: data.data.message })
            dispatch(setUser(data.data.user))
        } catch (error) {
            setError({ type: "error", error: error.response.data.message })
        }
    }
    const percent_number = process.env.PERCENT_NUMBER || 1000



    const [itemOption, setitemOption] = useState({ key: "", status: false })
    const handleshow = (key) => {
        setitemOption({ key: key, status: itemOption.key == key ? !itemOption.status : true })
    }
    return (
        <div className=' p-4'>
            <div className={`grid grid-cols-4 gap-6 ${cla}`}>
                {data.map(value => {
                    return (
                        <div key={value._id} className={` !border-[#e4e2e2] border  min-h-[360px] rounded-xl !rounded-tr-3xl   hover:!shadow-2xl overflow-hidden duration-500 col-span-1  text-start shadow-lg cursor-pointer`}>
                            <h1 className='text-center text-xl px-4 py-2 font-medium border-b !border-[#f0f0f0] bg-[#fff] text-[#267efa]'>{value.key}</h1>
                            {itemOption.key === value.key && itemOption.status === true ? <div className='h-[300px] text-center grid grid-cols-2 gap-4 p-4'>
                                {value.option.map(item => {
                                    return (
                                        <div key={item.product_timezone} onClick={() => { setvalueSmetaPackage(item._id) }} className={`col-span-1 animation_show border bg-[#f3f9ff]  ${valueSmetaPackage === item._id ? "!border-[#267efa]" : "!border-[#fff]"} duration-300 flex flex-col justify-center items-center`}>
                                            <p className='text-xl text-[#267efa] font-medium'>{priceFormat(item.product_price / Number(percent_number))} C</p>
                                            <p className='italic text-[#687a8f]'>{item.product_timezone / 30} Tháng</p>
                                        </div>
                                    )
                                })}
                            </div> : <div className='h-[300px] text-center flex justify-center items-center flex-col'>
                                Desc
                            </div>}
                            {/* <p className=' px-4 pb-2  pt-4'> {value.product_price / Number(percent_number)} C</p> */}
                            <div className='flex justify-center items-center p-2 px-4'>
                                <button onClick={() => { handleshow(value.key) }} className='bg-[#267efa] cursor-pointer duration-300 hover:bg-[#0a519d] px-12 py-2 rounded-md  text-white w-full font-medium text-base'>Option</button>
                            </div>
                        </div>
                    )

                })}

            </div>
            <button className='px-4 py-2 border !border-[#e0e0e0] text-xl !rounded-md mt-6 hover:!border-[#0a519d] duration-300 cursor-pointer' onClick={buypackage}> Thanh Toán</button>

        </div>
    )
}

export default ProductPackage