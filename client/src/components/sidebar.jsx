import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setUser, setDataToken } from "../redux/counterSlice";
import RefreshToken from "../pages/RefreshToken";
import instace from '../pages/customer_axios';
import Cookies from "js-cookie";


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
                <NavLink to='/extention' className='side-link' onClick={closeSidebar}>
                    <div className='icon'><i className="fa-solid fa-house"></i></div>
                    <div className='link-text'>{t('home')}</div>
                </NavLink>
                <NavLink to='/sharepixel' className='side-link' onClick={closeSidebar}>
                    <div className='icon'><i className="fa-solid fa-shapes"></i></div>
                    <div className='link-text'>{t('sharepixel')}</div>
                </NavLink>
                <NavLink to='/shareadaccount' className='side-link' onClick={closeSidebar}>
                    <div className='icon'><i className="fa-solid fa-vector-square"></i></div>
                    <div className='link-text'>{t('shareAdAccount')}</div>
                </NavLink>
                <NavLink to='/createadaccount' className='side-link' onClick={closeSidebar}>
                    <div className='icon'><i className="fa-solid fa-plus"></i></div>
                    <div className='link-text'>{t('createAdAccount')}</div>
                </NavLink>
                <NavLink to='/setcamp' className='side-link' onClick={closeSidebar}>
                    <div className='icon'><i className="fa-solid fa-bullhorn"></i></div>
                    <div className='link-text'>{t('setCamp')}</div>
                </NavLink>
            </div>
            <div className='bottom'>
                <div className='Profile'>
                    <div className='avatar'>
                        <img src='/avatar.png' alt='avatar'></img>
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