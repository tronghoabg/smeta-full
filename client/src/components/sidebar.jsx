import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setUser, setDataToken, setbuyaction } from "../redux/counterSlice";
import RefreshToken from "../pages/RefreshToken";
import instace from '../pages/customer_axios';
import Cookies from "js-cookie";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { CiUnlock, CiLock } from "react-icons/ci";



const Sidebar = ({ active }) => {
    const nav = useNavigate()
    const [name, setName] = useState('')
    const { t } = useTranslation();
    const closeSidebar = () => {
        active(false)
    }
    useEffect(() => {
        const facebookname = localStorage.getItem('facebookname')
        setName(facebookname)
    }, [])

    const dispatch = useDispatch()

    const counter = useSelector((state) => state.counter);
    let { dataToken, user } = counter;

    const Logout = async () => {
        try {
            const newDatatoken = await RefreshToken(dataToken);
            dispatch(setDataToken(newDatatoken));
            const headers = {
                Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""}`,
            };
            const data = await instace.patch("/auth/logout", null, { headers });
            if (data?.data?.message == "Đăng xuất thành công") {
                Cookies.remove("datatoken");
                localStorage.removeItem('facebookname')
                dispatch(setUser(null));
                active(false)
                dispatch(setDataToken(null));
                nav('/login')
            }
            // Rest of your code
        } catch (error) {
            console.log(error);
        }
    }

    const handleGotoLogin = () =>{
        closeSidebar()
        nav('/login')
    }
    const planData = ['share pixel','Create Ad Account','Create Campaign', 'Share TKQC']
    const handlebuyaction=()=>{
        dispatch(setbuyaction(true))
        nav("/")
    }
    const checkAll = user?.action.find(value=> value.key === "All")
console.log(checkAll);
    return (
        <div className='sidebar' >
            <div className='top'>
                <div className="btnMenu"
                    onClick={closeSidebar}
                >
                    <i className="fa-solid fa-xmark"></i>
                </div>
            </div>
            <div className='mid'>
                <NavLink to='/extention' className='side-link flex pr-1 !justify-between items-center' onClick={closeSidebar}>
                    <div className='flex'>
                    <div className='icon'><i className="fa-solid fa-house"></i></div>
                    <div className='link-text'>{t('home')}</div>
                    </div>
                </NavLink>
                <NavLink to='/sharepixel' className='side-link flex pr-1 !justify-between items-center' onClick={closeSidebar}>
                    <div className='flex'>
                    <div className='icon'><i className="fa-solid fa-shapes"></i></div>
                    <div className='link-text'>{t('sharepixel')}</div>
                    </div>
                    <CiUnlock className="text-xl "/>
                </NavLink>
                <NavLink to='/shareadaccount' className='side-link flex pr-1 !justify-between items-center' onClick={closeSidebar}>
                    <div className='flex'>
                    <div className='icon'><i className="fa-solid fa-vector-square"></i></div>
                    <div className='link-text'>{t('shareAdAccount')}</div>
                    </div>
                    {user?.action.find(value=> value.key === "Share TKQC") || checkAll ? <CiUnlock className="text-xl "/> : <CiLock className='text-xl text-yellow-400 '/>}
                </NavLink>
                <NavLink to='/createadaccount' className='side-link flex pr-1 !justify-between items-center' onClick={closeSidebar}>
                    <div className='flex'>
                    <div className='icon'><i className="fa-solid fa-plus"></i></div>
                    <div className='link-text'>{t('createAdAccount')}</div>
                    </div>
                    {user?.action.find(value=> value.key === "Create Ad Account") || checkAll ? <CiUnlock className="text-xl "/> : <CiLock className='text-xl text-yellow-400 '/>}

                </NavLink>
                <NavLink to='/setcamp' className='side-link flex pr-1 !justify-between items-center' onClick={closeSidebar}>
                    <div className='flex'>
                    <div className='icon'><i className="fa-solid fa-bullhorn"></i></div>
                    <div className='link-text'>{t('setCamp')}</div>
                    </div>
                    {user?.action.find(value=> value.key === "Create Campaign") || checkAll ? <CiUnlock className="text-xl "/> : <CiLock className='text-xl text-yellow-400 '/>}

                </NavLink>
            </div>
            
            <div className='bottom '>
                {/* <div className='mb-8'>
                {planData.map(value=>{
                    let checked = false
                    const allcheck=user?.action.find(value=>value.key==="All")
                    if(allcheck){
                        checked=true
                    }else{
                        user?.action.map(item=>{
                            if(item.key === value){
                                return(
                                    checked = true
                                )
                            }
                        })
                    }
                    
                    return(
                        <div className={`flex text-white items-center mr-2 text-base my-2 ${checked ? "text-yellow-500":""}`}>
                            <BsFillCheckCircleFill className={`mr-2 ${checked ?"text-green-500":""}`}/>
                            {value}
                            {value === "share pixel" ?<span className='text-xs text-white ml-4'>Free</span>:null }
                            
                        </div>
                    )
                })}
                <button onClick={handlebuyaction} className='text-base text-center bg-[#3ef15e] hover:text-white px-8 hover:scale-110 duration-300 py-2 rounded-lg mt-8'>Mua thêm</button>
            </div> */}

                <div className='Profile'>
                    <div className='avatar'>
                        <img onClick={()=>{nav('/')}} className=' cursor-pointer' src='/avatar.png' alt='avatar'></img>
                    </div>
                    <div className='controller'>
                        <div className='name  cursor-pointer'>{user ? user.username : <p  onClick={handleGotoLogin}>Đăng Nhập</p>}</div>
                        {user ? <div to='/register cursor-pointer' className='side-link' onClick={() => Logout()}>
                            <div className='link-text cursor-pointer'>Đăng Xuất</div>
                        </div> : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar