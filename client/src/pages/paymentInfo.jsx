import React, { useEffect, useState } from 'react'
import instace from './customer_axios'
import RefreshToken from "./RefreshToken";
import { setDataToken, setUser } from "../redux/counterSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from '../components/Loading';
import dateFormat from '../config/dateFormat';

function PaymentInfo() {
    const counter = useSelector((state) => state.counter);
    let { dataToken, user } = counter
    const [data, setdata] = useState([])
    const dispatch = useDispatch()
    const [loadingInfo, setloadingInfo] = useState(false)
    useEffect(() => {
        setloadingInfo(true)
        RefreshToken(dataToken)
            .then(value => {
                dispatch(setDataToken(value));
                const tokennew = value
                let newdata = []
                instace.get('/buypackage/getAllpackagebuyed', {
                    headers: {
                        Authorization: `Bearer ${tokennew ? tokennew.accessToken : ""
                            }`,
                    }
                })
                    .then(value => {
                        let data = value.data
                        newdata = [...newdata, ...data]

                        instace.get('/payment/getuserpayment', {
                            headers: {
                                Authorization: `Bearer ${tokennew ? tokennew.accessToken : ""
                                    }`,
                            }
                        })
                            .then(value => {
                                let data = value.data
                                newdata = [...newdata, ...data]
                                newdata = newdata.map(value => {
                                    if (value.key) {
                                        value.createdAt = value.time_start
                                    }
                                    return value
                                }).sort((a, b) => {
                                    const timeA = new Date(a.createdAt).getTime();
                                    const timeB = new Date(b.createdAt).getTime();
                                    return timeB - timeA;
                                });
                                setloadingInfo(false)
                                setdata(newdata)
                            })
                    })

            })

    }, [])
    console.log(data);
const percent_number = process.env.PERCENT_NUMBER || 1000
console.log(percent_number, 123123123);
    const tablehead = [
        { label: "STT", key: "stt" },
        { label: "Name", key: "username" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone" },
        { label: "Action", key: "action" },
        { label: "Date", key: "createAt" },
        { label: "Money", key: "totleMoney" },
    ];
    return (
        <div className='p-4'>
            <table className="w-full table-auto border !border-[#ccc] border-collapse">
                <thead>
                    <tr>
                        {tablehead.map((value, index) => {
                            return (
                                <th
                                    className={`p-2 !border-[#ccc] border text-sm cursor-pointer `}
                                    key={index}
                                >
                                    <div className="flex justify-between items-center">
                                        {value.label}
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                {!loadingInfo ? (
                    <tbody>
                        {data?.map((value, index) => {
                            if (value.key) {
                                return (
                                    <tr
                                        key={index}
                                        className={`!border-[#ccc] border text-sm `}
                                    >
                                        <td className="!border-[#ccc] border p-2 text-center">{index + 1}</td>
                                        <td className="!border-[#ccc] border p-2 ">{user?.username}</td>
                                        <td className="!border-[#ccc] border p-2 ">{user?.email}</td>
                                        <td className="!border-[#ccc] border p-2">
                                            {user?.phone}
                                        </td>
                                        <td className="!border-[#ccc] border p-2 text-start ">
                                            <span className='text-red-500'>Mua</span>- <span className='text-xs'>{value.key}</span>
                                        </td>
                                        <td className="!border-[#ccc] border p-2 text-end pr-10">
                                            {dateFormat(value.createdAt)}
                                        </td>
                                        <td className="!border-[#ccc] border p-2 text-center text-base text-red-500 font-medium">
                                            -{value.price / Number(percent_number)}
                                        </td>
                                    </tr>
                                )
                            }else{
                            return (
                                <tr
                                key={index}
                                className={`!border-[#ccc] border text-sm `}
                            >
                                <td className="!border-[#ccc] border p-2 text-center">{index + 1}</td>
                                <td className="!border-[#ccc] border p-2 ">{user?.username}</td>
                                <td className="!border-[#ccc] border p-2 ">{user?.email}</td>
                                <td className="!border-[#ccc] border p-2">
                                    {user?.phone}
                                </td>
                                <td className="!border-[#ccc] border p-2 text-start ">
                                    <span className='text-green-500'>Nạp tiền</span>
                                </td>
                                <td className="!border-[#ccc] border p-2 text-end pr-10">
                                    {dateFormat(value.createdAt)}
                                </td>
                                <td className="!border-[#ccc] border p-2 text-center text-base text-green-500 font-medium">
                                    +{value.amount / Number(percent_number)}
                                </td>
                            </tr>
                            )
                            }
                            // return (
                            //   <tr
                            //     key={index}
                            //     className={`border text-sm `}
                            //   >
                            //     <td className="border p-2 text-center">{index + 1}</td>
                            //     <td className="border p-2 ">{value.username}</td>
                            //     <td className="border p-2 ">{value.email}</td>
                            //     <td className="border p-2">
                            //       {value.phone}
                            //     </td>
                            //     <td className="border p-2 text-center">
                            //       {value?.action?.length > 0 ? value.action.map(value=> value.key).join(", ") : "None" }
                            //     </td>
                            //     <td className="border p-2 text-center">
                            //       {value.role}
                            //     </td>
                            //     <td className="border p-2 text-center">
                            //       {value.createAt}
                            //     </td>
                            //     <td className="border p-2 text-center">
                            //       {value.totleMoney}
                            //     </td>
                            //     <td className="border p-2 text-center">
                            //       {value.usedMonney}
                            //     </td>
                            //     <td className="border p-2 text-center">
                            //     </td>
                            //   </tr>
                            // );
                        })}
                    </tbody>
                ) : (
                    <div className="w-full h-[500px] flex justify-center items-center">
                        <Loading />
                    </div>
                )}
            </table>
        </div>
    )
}

export default PaymentInfo