import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Footer = (props) => {
    const { i18n } = useTranslation();
    const [lng, setLng] = useState('vi');

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
        setLng(lng)
    }

    return (
        <footer>
            <div className="footer-left">
                <div><i className="fa-brands fa-telegram"></i> Support</div>
            </div>

            <div className="footer-right">
                <div className="language">

                    <span
                        className={lng === 'vi' ? 'active' : ''}
                        onClick={() => changeLanguage('vi')}
                    >
                        <img src="/vi.png" alt="VI"></img>
                    </span>
                    <span
                        className={lng === 'en' ? 'active' : ''}
                        onClick={() => changeLanguage('en')}
                    >
                        <img src="/en.png" alt="EN"></img>
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default Footer