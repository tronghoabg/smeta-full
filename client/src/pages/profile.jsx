import { useEffect, useState } from "react"
import HomeHeader from "../components/home/HomeHeader"
import HomeFooter from "../components/home/HomeFooter"
import { TbArrowBackUp } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import validatePass from "../config/validatePass"
import instace from "./customer_axios";
import { setUser, setDataToken } from "../redux/counterSlice";
import RefreshToken from "./RefreshToken";
import Payment from "./payment";
import PaymentInfo from "./paymentInfo";
import priceFormat from "../config/priceFormat";
import { useTranslation } from "react-i18next";
import Newpaymentpackage from "./newpaymentpackage";
import validatePhoneNumber from "../config/validataPhone";
import validateEmail from "../config/validateEmail"
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BiSolidUserCircle, BiCoinStack, BiSolidColor, BiHistory } from "react-icons/bi";


const Profile = ({ setdisable }) => {
    const [searchParams] = useSearchParams();
    const queryParamValue = !searchParams.get('option') ? "profile" : searchParams.get('option');
    const counter = useSelector((state) => state.counter);
    let { dataToken, user } = counter
    const [openChange, setOpenChange] = useState(false)
    const [dataPass, setDataPass] = useState({ oldpass: null, newPass: null, renewPass: null })
    const [error, setError] = useState({ type: "error", error: "" });
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        if(setdisable){
            setdisable(false)
        }
    }, [])

    const percent_number = process.env.PERCENT_NUMBER || 1
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timeZoneName: 'short'
    };

    const dataProfile = [
        { title: "Tên tài khoản", value: user?.username },
        { title: "Email", value: user?.email, key: "email" },
        { title: "Số điện thoại", value: user?.phone, key: "phone" },
        { title: "Ngôn ngữ", value: user?.language },
        { title: "Số dư", value: user?.totleMoney },
        { title: "Số tiền đã xử dụng", value: user?.usedMonney },
        { title: "Role", value: user?.role },
        { title: "Premium", value: user?.action?.length > 0 ? user.action.map(value => value.key).join(", ") : "None" },
        { title: "Ngày đăng ký", value: (user && user.createAt) ? (new Intl.DateTimeFormat('en-US', options)).format(new Date(user.createAt)) : "..." },
    ]

    const handleChangeValue = (e, key) => {
        const newdata = { ...dataPass, [`${key}`]: e.target.value }
        setDataPass(newdata)
    }
    const dispatch = useDispatch()
    const handleChangePassword = async () => {
        setError({ type: "success", error: "" })
        setOpen(true)
        if (dataPass.newPass && dataPass.oldpass && dataPass.renewPass) {
            if (validatePass(dataPass.newPass)) {
                if (dataPass.renewPass === dataPass.newPass) {
                    try {
                        const newDatatoken = await RefreshToken(dataToken);
                        dispatch(setDataToken(newDatatoken));
                        const data = await instace.post('/pass/changePassword', { passwords: dataPass.renewPass, password_cu: dataPass.oldpass, password_change: dataPass.newPass }, {
                            headers: {
                                Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""
                                    }`,
                            },
                        })
                        setError({ type: "success", error: data.data.message })
                        setOpenChange(false)
                    } catch (error) {
                        setError({ type: "error", error: error.response.data.message })
                    }
                } else {
                    setError({ type: "error", error: "Mật khẩu không trùng khớp" })
                }
            } else {
                setError({ type: "error", error: "Sai đinh dạng" })
            }
        } else {
            setError({ type: "error", error: "Điền đủ thông tin" })
        }
    }

    const [updateInfo, setUpdateInfo] = useState({ email: user?.email, phone: user?.phone })

    useEffect(() => {
        setUpdateInfo({ email: user?.email, phone: user?.phone })
    }, [user])
    const [openkeyupdate, setopenkeyupdate] = useState({ email: false, phone: false })

    const hanldOpenchange = (key) => {
        setopenkeyupdate({ ...openkeyupdate, [`${key}`]: !openkeyupdate[`${key}`] })
    }

    const handlechangeinfo = (key, value) => {
        setUpdateInfo({ ...updateInfo, [`${key}`]: value })
    }

    const hanldOpenchangeCancel = (key) => {
        setopenkeyupdate({ ...openkeyupdate, [`${key}`]: false })
    }

    const hanldleSave = async (key) => {
        setError({ type: "success", error: "" })
        setOpen(true)
        if (validateEmail(updateInfo.email) && validatePhoneNumber(updateInfo.phone)) {
            const newDatatoken = await RefreshToken(dataToken);
            dispatch(setDataToken(newDatatoken));
            const data = await instace.patch('/auth/updateinfo', {
                email: updateInfo.email,
                phone: updateInfo.phone
            }, {
                headers: {
                    Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""
                        }`,
                },
            })
            setError({ type: "success", error: "Cập nhật thành công" })
            dispatch(setUser(data.data.user))
            setopenkeyupdate({ ...openkeyupdate, [`${key}`]: !openkeyupdate[`${key}`] })
        } else {
            setError({ type: "error", error: "Sai định dạng" })
        }
    }


    const renderProps = () => {
        switch (queryParamValue) {
            case "profile":
                return (
                    <div>
                        <h1 className="text-xl text-[#000] font-medium mt-[40px] mb-[50px]">Thông tin cá nhân</h1>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col justify-center items-center col-span-1 border !border-[#999] p-4 rounded-md">
                                <img className="w-[190px] rounded-full" src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="" />
                                <p className="text-xl mt-4">{user?.username}</p>
                                {!openChange ? <button className="text-[16px] text-blue-600 mt-4" onClick={() => { setOpenChange(true) }}>{t('Đổi mật khẩu')}</button>
                                    : null}
                            </div>
                            <div className="col-span-2 border !border-[#999] h-fit  p-4 text-[16px] text-[#212529] rounded-md">
                                {!openChange ? <div>
                                    {dataProfile.map(value => {
                                        if (value.title === "Email" || value.title === "Số điện thoại") {
                                            return (
                                                <div key={value.title} className="flex border-b border-b-[#c2c1c1] py-3">
                                                    <div className="w-[200px] mr-[50px]">{t(value.title)}</div>
                                                    {openkeyupdate[`${value.key}`] ?
                                                        <div className="w-full text-[#212529BF]">
                                                            <input onChange={(e) => { handlechangeinfo(value.key, e.target.value) }} value={updateInfo[`${value.key}`]} type="text" className="h-full !p-0 px-2" />
                                                        </div> : <div className="w-full text-[#212529BF]">{value.value}</div>}

                                                    {openkeyupdate[`${value.key}`] ? <div className="flex items-center">
                                                        <div onClick={() => { hanldOpenchangeCancel(value.key) }} className="mr-4 rounded-lg px-2 py-1 bg-red-500 shadow-md text-xs cursor-pointer text-[#fff]  hover:scale-105 duration-300">
                                                            Cancel
                                                        </div>
                                                        <div onClick={() => { hanldleSave(value.key) }} className="mr-4 rounded-lg px-2 py-1 bg-blue-500 shadow-md text-xs cursor-pointer text-[#fff]  hover:scale-105 duration-300">
                                                            Save
                                                        </div>
                                                    </div> : <div onClick={() => { hanldOpenchange(value.key) }} className="mr-4 rounded-lg px-2 py-1 bg-yellow-500 shadow-md text-xs cursor-pointer hover:text-blue-600 hover:scale-105 duration-300">
                                                        Edit
                                                    </div>}

                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div key={value.title} className="flex border-b border-b-[#c2c1c1] py-3">
                                                    <div className="w-[200px] mr-[50px]">{t(value.title)}</div>
                                                    <div className="w-full text-[#212529BF]">{value.title === "Số dư" || value.title === "Số tiền đã xử dụng" ? `${priceFormat(value.value / Number(percent_number))} C` : priceFormat(value.value)}</div>
                                                </div>
                                            )
                                        }

                                    })}
                                </div> : <div>
                                    <h1 className="flex items-center justify-start mb-4"> <TbArrowBackUp onClick={() => { setOpenChange(false) }} className="mr-2 cursor-pointer hover:scale-125 hover:text-blue-600 text-xl duration-300" /> {t('Đổi mật khẩu')}</h1>
                                    <div>
                                        <p className='text-base mb-2 '>{t('Mật khẩu hiện tại:')}</p>
                                        <input type="email" className='w-full focus:border-1 placeholder:italic placeholder:text-sm focus:border-blue-800 mb-2 p-1 ' value={dataPass.oldpass} onChange={(e) => { handleChangeValue(e, "oldpass") }} placeholder={t('password')} />
                                    </div>
                                    <div>
                                        <p className='text-base mb-1 mt-1 '>{t('Mật khẩu mới:')}</p>
                                        <input type="text" className='w-full focus:border-1 placeholder:italic placeholder:text-sm focus:border-blue-800 mb-2 p-1 ' value={dataPass.newPass} onChange={(e) => { handleChangeValue(e, "newPass") }} placeholder={t('Mật khẩu mới:')} />
                                    </div>
                                    <div>
                                        <p className='text-base mb-1 mt-1 '>{t("Xác nhận:")}</p>
                                        <input type="text" className='w-full focus:border-1 placeholder:italic placeholder:text-sm focus:border-blue-800 mb-2 p-1 ' value={dataPass.renewPass} onChange={(e) => { handleChangeValue(e, "renewPass") }} placeholder={t("Xác nhận:")} />
                                    </div>
                                    <div className="flex justify-center">
                                        <button onClick={handleChangePassword} className="text-base rounded-md text-white px-20 mt-4 py-2 bg-[#004a99f5] hover:bg-[#2c5f96f5]">{t('Đổi mật khẩu')}</button>
                                    </div>
                                </div>}

                            </div>
                        </div>
                    </div>
                )

            case "payment":
                return (
                    <div>
                        <h1 className="text-xl text-[#000] font-medium my-[40px]  mb-[50px]">{t('Mua coin')}</h1>
                        {/* border !border-[#999] */}
                        <div id="payment" className=" h-fit mb-5 border !border-[#f0f0f0]">
                            <Payment setError={setError} />
                        </div></div>
                )

            case "buypackage":
                return (
                    <div>
                        <h1 className="text-xl text-[#000] font-medium my-[40px] mb-3">{t('Mua Gói')}</h1>
                        <div className=" h-fit mb-5 border !border-[#f0f0f0]">
                            {/* <ProductPackage setError={setError} setOpen={setOpen} /> */}
                            <Newpaymentpackage setError={setError} setOpen={setOpen} />
                        </div>
                    </div>
                )

            case "paymentinfo":
                return (
                    <div>
                        <h1 className="text-xl text-[#000] font-medium my-[40px] mb-3">{t('Thông tin thanh toán')}</h1>
                        <div className="h-[calc(100vh-160px)] mb-5 border !border-[#f0f0f0]  overflow-hidden overflow-y-auto p-0.5">
                            <PaymentInfo />
                        </div>
                    </div>
                )

            default:
                break;
        }
    }

    const dataoptions = [
        { name: "Thông tin cá nhân", value: "profile", icon: <BiSolidUserCircle /> },
        { name: "Mua coin", value: "payment", icon: <BiCoinStack /> },
        { name: "Mua gói", value: "buypackage", icon: <BiSolidColor /> },
        { name: "Lịch sử thanh toán", value: "paymentinfo", icon: <BiHistory /> },
    ]

    const nav = useNavigate()


    return (
        <>
            <HomeHeader classfull="!w-full" />
            <div className="w-full min-h-screen bg-[#fff] py-[50px] flex justify-center items-center" >
                {error?.error?.length > 0 ? (
                    <Snackbar
                        className='!z-[9999999]'
                        open={open}
                        autoHideDuration={1000}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    >
                        <Alert onClose={handleClose} severity={error.type} sx={{ width: "100%" }}>
                            {error.error}
                        </Alert>
                    </Snackbar>
                ) : (
                    <p>{null}</p>
                )}
                <div className="w-full min-h-[600px] grid grid-cols-12 gap-4">
                    <div className=" shadow-lg col-span-2 h-screen pt-[60px] ">
                        {dataoptions.map(value => {
                            return (
                                <div onClick={() => { nav(`/profile?option=${value.value}`) }} key={value.value}
                                    className={`hover:bg-[#F3F3F3] flex items-center  p-4 cursor-pointer font-medium ${queryParamValue === value.value ? "!bg-[#F3F3F3]" : "!bg-[#fff]"}`}>
                                    <div className="mr-4 text-xl">
                                        {value.icon}
                                    </div>
                                    <p>{value.name}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className="col-span-10 px-2">
                        {renderProps()}
                    </div>
                </div>
            </div>
            <HomeFooter />
        </>
    )
}



export default Profile