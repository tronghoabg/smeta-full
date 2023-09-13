import { useTranslation } from 'react-i18next';

const Logs = (props) => {
    const { t } = useTranslation();
    const {log} = props
    return (
        <div className='log'>
            <div className="header">{t('executionLog')}</div>
            <ul>
                {log && 
                    log.map((item, index) => {
                        return (
                            <li key={index}>{item}</li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default Logs