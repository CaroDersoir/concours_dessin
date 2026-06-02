// Composant formulaire connexion / inscription
import '../styles/LoginDetail.css';
import {useEffect, useRef, useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {login, register} from '../service/customerServiceFront';
import {LanguageContext} from '../context/languageContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RECAPTCHA_SITE_KEY = '6LcoJQYtAAAAAORGw4AA2bG07gfSO0SQjgGMfKl8'; // ← clé publique Google reCAPTCHA

function LoginDetail() {
    const {t} = useContext(LanguageContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const history = useHistory();
    const recaptchaRef = useRef(null);
    const widgetIdRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            history.push('/profile');
        }
    }, [history]);

    useEffect(() => {
        if (!isSignup || !recaptchaRef.current) return;
        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: RECAPTCHA_SITE_KEY,
            callback: setRecaptchaToken,
            'expired-callback': () => setRecaptchaToken(''),
        });
        return () => {
            setRecaptchaToken('');
            widgetIdRef.current = null;
        };
    }, [isSignup]);

    const handleSwitch = () => {
        setIsSignup(!isSignup);
        setErrorMessage('');
        setConfirmPassword('');
        setRecaptchaToken('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (isSignup) {
            if (!EMAIL_REGEX.test(email)) {
                setErrorMessage(t('login_error_email'));
                return;
            }
            if (password !== confirmPassword) {
                setErrorMessage(t('login_error_password_match'));
                return;
            }
            if (!recaptchaToken) {
                setErrorMessage(t('login_error_captcha'));
                return;
            }
        }

        try {
            if (isSignup) {
                await register(email, password, recaptchaToken);
                history.push(`/verify-email?email=${encodeURIComponent(email)}`);
            } else {
                const data = await login(email, password);
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('isAdmin', data.isAdmin ? 'true' : 'false');
                history.push('/profile');
            }
        } catch (error) {
            if (isSignup && widgetIdRef.current !== null) {
                window.grecaptcha.reset(widgetIdRef.current);
                setRecaptchaToken('');
            }
            const data = error.response?.data;
            if (data?.requireVerification) {
                history.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
                return;
            }
            const status = error.response?.status;
            if (status === 401) setErrorMessage(t('login_error_credentials'));
            else if (status === 409) setErrorMessage(t('login_error_email_used'));
            else if (status === 500) setErrorMessage(t('login_error_server'));
            else setErrorMessage(t('login_error'));
        }
    };

    return (
        <div className="login">
            <div className="login__card">
                <h2 className="login__title">{isSignup ? t('login_title_register') : t('login_title_login')}</h2>

                {errorMessage && <p className="login__error">{errorMessage}</p>}

                <form className="login__form" onSubmit={handleSubmit}>
                    <input
                        className="login__input"
                        type="email"
                        placeholder={t('login_email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="login__input"
                        type="password"
                        placeholder={t('login_password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {isSignup && (
                        <input
                            className="login__input"
                            type="password"
                            placeholder={t('login_placeholder_confirm')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    )}
                    {isSignup && <div ref={recaptchaRef}></div>}
                    <button className="login__submit" type="submit">
                        {isSignup ? t('login_btn_register') : t('login_btn_login')}
                    </button>
                </form>

                <div className="login__divider">
                    {isSignup ? t('login_already_account') : t('login_no_account')}
                </div>
                <button className="login__switch" onClick={handleSwitch}>
                    {isSignup ? t('login_switch_login') : t('login_switch_register')}
                </button>
            </div>
        </div>
    );
}

export default LoginDetail;
