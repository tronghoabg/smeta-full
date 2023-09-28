import React, { useState, useEffect } from 'react'
import instace from '../../pages/customer_axios';
import { setUser, setDataToken } from "../../redux/counterSlice";
import { useDispatch, useSelector } from "react-redux";
import RefreshToken from "../../pages/RefreshToken";

function Package() {
    const counter = useSelector((state) => state.counter);
    let { dataToken, user, darkmode } = counter
    const dispatch = useDispatch()
    const [datapackage, setdatapackage] = useState([]);
    const [openEditDiscount, setOpenEditDiscount] = useState({ key: "", value: "" })
    const [openEditPrice, setOpenEditPrice] = useState({ id: "", value: "" })
    const [refe, setrefe] = useState(true)

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
                setdatapackage(datasss)
            })
    }, [refe])

    function daoViTri(arr) {
        if (arr.length >= 5) {  // Đảm bảo mảng có ít nhất 5 phần tử
            [arr[2], arr[4]] = [arr[4], arr[2]]
        }
        return arr;
    }

    const handleSaveDiscount = async () => {
        if (openEditDiscount.value) {
            try {
                const newDatatoken = await RefreshToken(dataToken);
                dispatch(setDataToken(newDatatoken));
                const data = await instace.post('/admin/updatediscount', {
                    timezone: openEditDiscount.key,
                    newdiscount: openEditDiscount.value
                }, {
                    headers: {
                        Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""
                            }`,
                    },
                })
                setOpenEditDiscount({ key: "", value: "" })
                setrefe(!refe)
                console.log("ok");
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("điền đủ thông tin");
        }

    }

    const handleChangeDis = (e, value) => {
        if (e.target.value >= 0) {
            setOpenEditDiscount({ key: value.product_timezone, value: e.target.value })
        }
    }

    const handleSavePrice = async () => {
        if (openEditPrice.value) {
            try {
                const newDatatoken = await RefreshToken(dataToken);
                dispatch(setDataToken(newDatatoken));
                const data = await instace.post('/admin/updatePrice', {
                    id: openEditPrice.id,
                    newPrice: openEditPrice.value
                }, {
                    headers: {
                        Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""
                            }`,
                    },
                })
                setOpenEditPrice({ id: "", value: "" })
                setrefe(!refe)
                console.log("ok");
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("điền đủ thông tin");
        }
    }

    const handleChangePrice = (e, item) => {
        if (e.target.value >= 0) {
            setOpenEditPrice({ id: item._id, value: e.target.value })
        }
    }
    return (
        <div>

            <div>
                <h1 className={`text-xl  mb-[12px] mt-[40px]  font-medium ${darkmode ? "text-[#fff]" : ""}`}>Discount </h1>
                <div className='w-[380px]'>
                    {datapackage[0]?.option.map(value => {
                        return (
                            <div className='flex items-center justify-between m-2 bg-[#f9fbfd] !border-[#c7c7c7] border p-4'>
                                <div> <span className='text-base font-medium '>{value.product_timezone / 30}</span> tháng</div>
                                {openEditDiscount.key === value.product_timezone ? <div className='text-base font-medium ml-8 '>
                                    <input type="number" onChange={(e) => { handleChangeDis(e, value) }} value={openEditDiscount.value} className='w-[80px] !p-0' /> %
                                </div> : <div className='text-base font-medium ml-8 '>
                                    {value.product_desc_discount} %
                                </div>}

                                {openEditDiscount.key === value.product_timezone ? <div className=''>

                                    <div onClick={() => { setOpenEditDiscount({ key: "", value: "" }) }} className=" rounded-lg px-2 py-1 bg-red-500 shadow-md text-xs cursor-pointer mb-1 text-[#fff]  hover:scale-105 duration-300">
                                        Cancel
                                    </div>
                                    <div onClick={handleSaveDiscount} className=" rounded-lg px-2 py-1 bg-blue-500 shadow-md text-xs cursor-pointer text-[#fff]  hover:scale-105 duration-300">
                                        Save
                                    </div>
                                </div> : <div onClick={() => { setOpenEditDiscount({ key: value.product_timezone, value: value.product_desc_discount }) }} className=" rounded-lg px-2 py-1 bg-yellow-500 shadow-md text-xs cursor-pointer hover:text-blue-600 hover:scale-105 duration-300">
                                    Edit
                                </div>}

                            </div>
                        )
                    })}
                </div>

            </div>
            <div className='flex flex-wrap'>
                {
                    datapackage.map((value, index) => {
                        return (
                            <div key={index} className='w-1/3'>
                                <h1 className={`text-xl  mb-[12px] mt-[40px]  font-medium ${darkmode ? "text-[#fff]" : ""}`}>{value.key}</h1>
                                <div className=' w-full '>
                                    {value.option.map(item => {
                                        return (
                                            <div className='flex items-center justify-between mr-8 mb-2 border bg-[#f9fbfd] !border-[#c7c7c7] p-2 !rounded-md'>

                                                <div className='flex items-center'>
                                                    <div className='mr-8'>
                                                        <p className=' font-medium mr-4'>Time</p>
                                                        <h1>{item.product_timezone / 30} tháng</h1>
                                                    </div>
                                                    <div className='mx-8'>
                                                        <p className=' font-medium mr-4'>Price</p>
                                                        {openEditPrice.id === item._id ? <div>
                                                            <input type="number" value={openEditPrice.value} onChange={(e) => { handleChangePrice(e, item) }} className='w-[80px]' />
                                                        </div> : <h1>{item.product_price} c</h1>}

                                                    </div>
                                                    <div className='mr-8'>
                                                        <p className=' font-medium mr-4'>Discount</p>
                                                        <h1>{item.product_desc_discount} %</h1>
                                                    </div>
                                                </div>

                                                {openEditPrice.id === item._id ? <div className=''>

                                                    <div onClick={() => { setOpenEditPrice({ id: "", value: "" }) }} className=" rounded-lg px-2 py-1 bg-red-500 shadow-md text-xs cursor-pointer mb-1 text-[#fff]  hover:scale-105 duration-300">
                                                        Cancel
                                                    </div>
                                                    <div onClick={handleSavePrice} className=" rounded-lg px-2 py-1 bg-blue-500 shadow-md text-xs cursor-pointer text-[#fff]  hover:scale-105 duration-300">
                                                        Save
                                                    </div>
                                                </div> : <div onClick={() => { setOpenEditPrice({ id: item._id, value: item.product_price }) }} className=" rounded-lg px-2 py-1 bg-yellow-500 shadow-md text-xs cursor-pointer hover:text-blue-600 hover:scale-105 duration-300">
                                                    Edit
                                                </div>}
                                                {/* <div className=" rounded-lg px-2 py-1 bg-yellow-500 shadow-md text-xs cursor-pointer hover:text-blue-600 hover:scale-105 duration-300">
                                                    Edit
                                                </div> */}

                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Package