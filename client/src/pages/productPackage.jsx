import React, { useEffect, useState } from 'react'
import instace from './customer_axios'
import RefreshToken from "./RefreshToken";
import { setDataToken, setUser } from "../redux/counterSlice";
import { useDispatch, useSelector } from "react-redux";

function ProductPackage() {
    const counter = useSelector((state) => state.counter);
    let { dataToken, user } = counter
    const [data, setdata] = useState([])
    const [valueSmetaPackage, setvalueSmetaPackage] = useState()
    const dispatch = useDispatch()
    useEffect(() => {
        instace.get('/buypackage/getallprouct')
            .then(value => {
                setdata(value.data)
                console.log(value);
            })

    }, [])

    const buypackage = async () => {
        const newDatatoken = await RefreshToken(dataToken);
        dispatch(setDataToken(newDatatoken));
        const data = await instace.post('/buypackage/buyer', { _id: valueSmetaPackage }, {
            headers: {
                Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""
                    }`,
            },
        })
        dispatch(setUser(data.data.user))
        console.log(data, "mua thanh cong");
    }
    return (
        <div className=' p-4'>
            <div className='grid grid-cols-5 gap-6'>
                {data.map(value => {
                    return (
                        <div key={value._id} onClick={() => { setvalueSmetaPackage(value._id) }} className={`border-2 rounded-lg ${valueSmetaPackage == value._id ? "border-2 !border-[#ff8b8b] scale-110 !shadow-lg" : "!border-[#f0f0f0]"} hover:shadow-lg overflow-hidden duration-500 col-span-1  text-start shadow-sm cursor-pointer`}>
                            <h1 className='text-xl px-4 py-2 font-medium border-b !border-[#f0f0f0] bg-[#0a519d] text-white'>{value.product_name}</h1>
                            <p className=' px-4 pb-2  pt-4'> {value.product_price / 1000} Bit</p>
                        </div>
                    )
                })}

            </div>
            <button className='px-4 py-2 border !border-[#e0e0e0] text-xl !rounded-md mt-6 hover:!border-[#0a519d] duration-300 cursor-pointer' onClick={buypackage}> Thanh Toán</button>

        </div>
    )
}

export default ProductPackage