// Footer avec formulaire d'évaluation (email + message) → envoi vers l'admin
import {useContext, useState} from 'react'
import '../styles/Footer.css'
import {LanguageContext} from '../context/languageContext';
import {sendEvaluation} from '../service/contactServiceFront';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Footer() {
    const {t} = useContext(LanguageContext);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null); // 'success' | 'error' | null

    async function handleSubmit(e) {
        e.preventDefault();
        if (!EMAIL_REGEX.test(email)) {
            setStatus('email_error');
            return;
        }
        if (!message.trim()) {
            setStatus('message_error');
            return;
        }
        try {
            await sendEvaluation(email, message);
            setEmail('');
            setMessage('');
            setStatus('success');
        } catch {
            setStatus('error');
        }
    }

    return (
        <footer className="footer">
            <form className="footer__form" onSubmit={handleSubmit}>
                <div className="footer__title">{t('footer_eval_title')}</div>
                <input
                    type="email"
                    className="input footer__input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t('footer_eval_email_placeholder')}
                />
                <textarea
                    className="input footer__input footer__textarea"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={t('footer_eval_message_placeholder')}
                />
                {status === 'email_error' && <p className="footer__feedback footer__feedback--error">{t('footer_email_error')}</p>}
                {status === 'message_error' && <p className="footer__feedback footer__feedback--error">{t('footer_eval_message_error')}</p>}
                {status === 'success' && <p className="footer__feedback footer__feedback--success">{t('footer_eval_success')}</p>}
                {status === 'error' && <p className="footer__feedback footer__feedback--error">{t('footer_eval_error')}</p>}
                <button className="btn" type="submit">{t('footer_email_submit')}</button>
                <div className="footer__note">{t('footer_copyright')}</div>
            </form>
        </footer>
    )
}

export default Footer
