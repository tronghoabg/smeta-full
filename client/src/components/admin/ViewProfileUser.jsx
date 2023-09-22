import React, { useEffect, useState } from 'react'
import instace from "../../pages/customer_axios";
import { useDispatch } from "react-redux";
import RefreshToken from "../../pages/RefreshToken";
import { setUser, setDataToken, setprofileId } from "../../redux/counterSlice";
import priceFormat from "../../config/priceFormat";
import dateFormat from "../../config/dateFormat";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { TbArrowBackUp } from "react-icons/tb";

function ViewProfileUser() {
  const counter = useSelector((state) => state.counter);
  const { darkmode, loading, dataToken, profileId } = counter;
  const dispatch = useDispatch();
  const [data, setData] = useState({})
  const { t } = useTranslation();


  useEffect(() => {

    const fetchData = async () => {
      try {
        const newDatatoken = await RefreshToken(dataToken);
        dispatch(setDataToken(newDatatoken));

        const response = await instace.get(`/admin/getuserbuyid/${profileId}`, {
          headers: {
            Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""}`,
          },
        });
        const dataa = response.data;
        setData(dataa)

      } catch (error) {
        console.error("Lỗi xảy ra khi gọi API:", error);
      }
    };
    if (profileId) {
      fetchData();
    }
  }, [])

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZoneName: 'short'
  };
  const percent_number = process.env.PERCENT_NUMBER || 1000

  const dataProfile = [
    { title: "Tên tài khoản", value: data.userProfile?.username },
    { title: "Email", value: data.userProfile?.email },
    { title: "Số điện thoại", value: data.userProfile?.phone },
    { title: "Ngôn ngữ", value: data.userProfile?.language },
    { title: "Số dư", value: data.userProfile?.totleMoney },
    { title: "Số tiền đã xử dụng", value: data.userProfile?.usedMonney },
    { title: "Role", value: data.userProfile?.role },
    { title: "Premium", value: data.userProfile?.action?.length > 0 ? data.userProfile.action.map(value => value.key).join(", ") : "None" },
    { title: "Ngày đăng ký", value: (data.userProfile && data.userProfile.createAt) ? (new Intl.DateTimeFormat('en-US', options)).format(new Date(data.userProfile.createAt)) : "..." },
  ]

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
    <div>
      <div className="w-[1200px] min-h-[600px] mt-[50px]">
        <h1 className="text-xl text-[#000] font-medium mb-3 ">
         <h1 className="flex items-center justify-start mb-4"> <TbArrowBackUp onClick={() => { dispatch(setprofileId("")) }} className="mr-2 cursor-pointer hover:scale-125 hover:text-blue-600 text-xl duration-300" /> Thông tin cá nhân</h1></h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col justify-center items-center col-span-1 border !border-[#999] p-4 rounded-md">
            <img className="w-[190px] rounded-full" src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="" />
            <p className="text-xl mt-4">{data.userProfile?.username}</p>
            {/* {!openChange ? <button className="text-[16px] text-blue-600 mt-4" onClick={() => { setOpenChange(true) }}>{t('Đổi mật khẩu')}</button>
                                : null} */}
          </div>
          <div className="col-span-2 border !border-[#999] h-fit  p-4 text-[16px] text-[#212529] rounded-md">
            {!false ? <div>
              {dataProfile.map(value => {
                return (
                  <div key={value.title} className="flex border-b border-b-[#c2c1c1] py-3">
                    <div className="w-[200px] mr-[50px]">{t(value.title)}</div>
                    <div className="w-full text-[#212529BF]">{value.title === "Số dư" || value.title === "Số tiền đã xử dụng" ? `${priceFormat(value.value / Number(percent_number))} C` : priceFormat(value.value)}</div>
                  </div>
                )
              })}
            </div> : null
              //  <div>
              //     <h1 className="flex items-center justify-start mb-4"> <TbArrowBackUp onClick={() => { setOpenChange(false) }} className="mr-2 cursor-pointer hover:scale-125 hover:text-blue-600 text-xl duration-300" /> {t('Đổi mật khẩu')}</h1>
              //     <div>
              //         <p className='text-base mb-2 '>{t('Mật khẩu hiện tại:')}</p>
              //         <input type="email" className='w-full focus:border-1 placeholder:italic placeholder:text-sm focus:border-blue-800 mb-2 p-1 ' value={dataPass.oldpass} onChange={(e) => { handleChangeValue(e, "oldpass") }} placeholder={t('password')} />
              //     </div>
              //     <div>
              //         <p className='text-base mb-1 mt-1 '>{t('Mật khẩu mới:')}</p>
              //         <input type="text" className='w-full focus:border-1 placeholder:italic placeholder:text-sm focus:border-blue-800 mb-2 p-1 ' value={dataPass.newPass} onChange={(e) => { handleChangeValue(e, "newPass") }} placeholder={t('Mật khẩu mới:')} />
              //     </div>
              //     <div>
              //         <p className='text-base mb-1 mt-1 '>{t("Xác nhận:")}</p>
              //         <input type="text" className='w-full focus:border-1 placeholder:italic placeholder:text-sm focus:border-blue-800 mb-2 p-1 ' value={dataPass.renewPass} onChange={(e) => { handleChangeValue(e, "renewPass") }} placeholder={t("Xác nhận:")} />
              //     </div>
              //     <div className="flex justify-center">
              //         <button onClick={handleChangePassword} className="text-base rounded-md text-white px-20 mt-4 py-2 bg-[#004a99f5] hover:bg-[#2c5f96f5]">{t('Đổi mật khẩu')}</button>
              //     </div>
              // </div>
            }

          </div>
        </div>

        {/* <h1 className="text-xl text-[#000] font-medium mt-[100px]  mb-3">{t('Mua coin')}</h1> */}
        {/* border !border-[#999] */}
        {/* <div id="payment" className=" h-fit mb-5 border !border-[#f0f0f0]">
                        <Payment setError={setError} />
                    </div>
                    <h1 className="text-xl text-[#000] font-medium mt-[100px] mb-3">{t('Mua Gói')}</h1>
                    <div className=" h-fit mb-5 border !border-[#f0f0f0]">
                        <ProductPackage setError={setError} setOpen={setOpen} />
                    </div> */}
        <h1 className="text-xl text-[#000] font-medium mt-[100px] mb-3">{t('Thông tin thanh toán')}</h1>
        <div className=" h-[480px] mb-5 border !border-[#f0f0f0]  overflow-hidden overflow-y-auto p-0.5">
          {/* <PaymentInfo /> */}
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
                { (
                    <tbody>
                        {data.userPayment?.map((value, index) => {
                            if (value.key) {
                                return (
                                    <tr
                                        key={index}
                                        className={`!border-[#ccc] border text-sm `}
                                    >
                                        <td className="!border-[#ccc] border p-2 text-center">{index + 1}</td>
                                        <td className="!border-[#ccc] border p-2 ">{data.userProfile.username}</td>
                                        <td className="!border-[#ccc] border p-2 ">{data.userProfile.email}</td>
                                        <td className="!border-[#ccc] border p-2">
                                            {data.userProfile.phone}
                                        </td>
                                        <td className="!border-[#ccc] border p-2 text-start ">
                                            <span className='text-red-500'>Mua</span>- <span className='text-xs'>{value.key}</span>
                                        </td>
                                        <td className="!border-[#ccc] border p-2 text-end pr-10">
                                            {dateFormat(value.time_start)}
                                        </td>
                                        <td className="!border-[#ccc] border p-2 text-center text-base text-red-500 font-medium">
                                            -{priceFormat(value.price / Number(percent_number))} C
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
                                <td className="!border-[#ccc] border p-2 ">{data.userProfile.username}</td>
                                <td className="!border-[#ccc] border p-2 ">{data.userProfile.email}</td>
                                <td className="!border-[#ccc] border p-2">
                                    {data.userProfile.phone}
                                </td>
                                <td className="!border-[#ccc] border p-2 text-start ">
                                    <span className='text-green-500'>Nạp tiền</span>
                                </td>
                                <td className="!border-[#ccc] border p-2 text-end pr-10">
                                    {dateFormat(value.createdAt)}
                                </td>
                                <td className="!border-[#ccc] border p-2 text-center text-base text-green-500 font-medium">
                                    +{priceFormat(value.amount / Number(percent_number))} C
                                </td>
                            </tr>
                            )
                            }
                        })}
                    </tbody>
                ) }
            </table>
        </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProfileUser