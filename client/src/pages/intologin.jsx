import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

const InToLogin = (props) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="tool-bar-error">
                <div className='icon'>
                    <i className="fa-solid fa-gear"></i>
                </div>
                <div className='link-text'>{t('error')}</div>
            </div>
            <div className="tab-content">
                <div className='install'>
                    <img src='/loginfb.png' alt='install'></img>
                    <h3>{t('errorFbTitle')}</h3>
                    <h4>{t('errorFbContent')}</h4>
                </div>
            </div>
        </>
    )
}

export default InToLogin