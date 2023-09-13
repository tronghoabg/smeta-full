import { useTranslation } from 'react-i18next';

const Install = (props) => {
    const { t } = useTranslation();
    const openLink = () => {
        window.open('https://chrome.google.com/webstore/detail/smeta/ookgnahfklmejhicejjbfjifppjbfnlk', '_blank');
    }
    return (
        <>
            <div className="tool-bar-error">
                <div className='icon'>
                    <i className="fa-solid fa-gear"></i>
                </div>
                <div className='link-text'>{t('install')}</div>
            </div>
            <div className="tab-content">
                <div className='install'>
                    <img src='/install.png' alt='install'></img>
                    <h3>{t('notInstallTitle')}</h3>
                    <h4>{t('notInstallContent')}</h4>
                    <button onClick={openLink}>{t('downloadFromStore')}</button>
                </div>
            </div>
        </>
    )
}
export default Install