import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = ({ active }) => {
    const nav = useNavigate()
    const [name ,setName] = useState('')
    const { t } = useTranslation();
    const closeSidebar = () => {
        active(false)
    }
    useEffect(() => {
    const facebookname= localStorage.getItem('facebookname')
     setName(facebookname)
    }, [])
    
    const Logout = ()=>{
        localStorage.removeItem('facebookname')
        active(false)
        nav('/register')
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
                        <div className='name'>{name ? name :<p>Đăng Nhập</p>}</div>
                        {name ?  <NavLink to='/register' className='side-link' onClick={()=>Logout()}>
                            <div className='link-text'>Đăng Xuất</div>
                        </NavLink>:<NavLink to='/intologin' className='side-link' onClick={closeSidebar}>
                            <div className='link-text'>đăng nhập</div>
                        </NavLink>
                         }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar