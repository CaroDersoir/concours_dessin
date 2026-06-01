// Composant formulaire connexion / inscription
import '../styles/LoginDetail.css';
import {useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {login, register} from '../service/customerServiceFront';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RECAPTCHA_SITE_KEY = '6LcoJQYtAAAAAORGw4AA2bG07gfSO0SQjgGMfKl8'; // ← clé publique Google reCAPTCHA

function LoginDetail() {
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
                setErrorMessage('Adresse email invalide.');
                return;
            }
            if (password !== confirmPassword) {
                setErrorMessage('Les mots de passe ne correspondent pas.');
                return;
            }
            if (!recaptchaToken) {
                setErrorMessage('Veuillez compléter le CAPTCHA.');
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
            setErrorMessage(data?.error || 'Erreur. Veuillez réessayer.');
        }
    };

    return (
        <div className="login">
            <div className="login__card">
                <h2 className="login__title">{isSignup ? 'Inscription' : 'Connexion'}</h2>

                {errorMessage && <p className="login__error">{errorMessage}</p>}

                <form className="login__form" onSubmit={handleSubmit}>
                    <input
                        className="login__input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="login__input"
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {isSignup && (
                        <input
                            className="login__input"
                            type="password"
                            placeholder="Confirmer le mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    )}
                    {isSignup && <div ref={recaptchaRef}></div>}
                    <button className="login__submit" type="submit">
                        {isSignup ? "S'inscrire" : 'Se connecter'}
                    </button>
                </form>

                <div className="login__divider">
                    {isSignup ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
                </div>
                <button className="login__switch" onClick={handleSwitch}>
                    {isSignup ? 'Se connecter' : "S'inscrire"}
                </button>
            </div>
        </div>
    );
}

export default LoginDetail;
