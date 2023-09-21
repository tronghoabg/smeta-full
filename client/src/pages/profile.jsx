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
import { message } from "antd";
import Payment from "./payment";
import ProductPackage from "./productPackage";
import PaymentInfo from "./paymentInfo";
import priceFormat from "../config/priceFormat";
import { useTranslation } from "react-i18next";

const Profile = ({ setdisable }) => {
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
        setdisable(false)
    }, [])
    const percent_number = process.env.PERCENT_NUMBER || 1000
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
        { title: "Email", value: user?.email },
        { title: "Số điện thoại", value: user?.phone },
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
        setOpen(true)
        if (dataPass.newPass && dataPass.oldpass && dataPass.renewPass) {
            if (validatePass(dataPass.newPass)) {
                if (dataPass.renewPass == dataPass.newPass) {
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
                        setError(error.response.data)
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
    return (
        <>
            <HomeHeader />
            <div className="w-full min-h-screen bg-[#fff] pt-[100px] flex justify-center items-center" >
                {error.error?.length > 0 ? (
                    <Snackbar
                        className='!z-[999999]'
                        open={open}
                        autoHideDuration={6000}
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
                <div className="w-[1200px] min-h-[600px] ">
                    <h1 className="text-xl text-[#000] font-medium mb-3">Thông tin cá nhân</h1>
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
                                    return (
                                        <div key={value.title} className="flex border-b border-b-[#c2c1c1] py-3">
                                            <div className="w-[200px] mr-[50px]">{t(value.title)}</div>
                                            <div className="w-full text-[#212529BF]">{value.title === "Số dư" || value.title === "Số tiền đã xử dụng" ?`${ priceFormat(value.value / Number(percent_number))} C` : priceFormat(value.value)}</div>
                                        </div>
                                    )
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

                    <h1 className="text-xl text-[#000] font-medium mt-[100px]  mb-3">{t('Mua coin')}</h1>
                    {/* border !border-[#999] */}
                    <div id="payment" className=" h-fit mb-5 border !border-[#f0f0f0]">
                        <Payment setError={setError} />
                    </div>
                    <h1 className="text-xl text-[#000] font-medium mt-[100px] mb-3">{t('Mua Gói')}</h1>
                    <div className=" h-fit mb-5 border !border-[#f0f0f0]">
                        <ProductPackage setError={setError} setOpen={setOpen} />
                    </div>
                    <h1 className="text-xl text-[#000] font-medium mt-[100px] mb-3">{t('Thông tin thanh toán')}</h1>
                    <div className=" h-[480px] mb-5 border !border-[#f0f0f0]  overflow-hidden overflow-y-auto p-0.5">
                        <PaymentInfo />
                    </div>
                </div>
            </div>
            <HomeFooter />
        </>
    )
}
export default Profile