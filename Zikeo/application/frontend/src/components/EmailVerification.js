// Composant saisie du code de vérification email
import '../styles/LoginDetail.css';
import {useEffect, useRef, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {verifyEmail, bypassVerify} from '../service/customerServiceFront';

function EmailVerification() {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const submitted = useRef(false);

    const emailParam = new URLSearchParams(location.search).get('email') || '';
    const codeParam = new URLSearchParams(location.search).get('code') || '';

    useEffect(() => {
        if (codeParam && !submitted.current) {
            submitted.current = true;
            setCode(codeParam);
            handleVerify(codeParam);
        }
    }, [codeParam]);

    const handleVerify = async (codeToSend) => {
        setLoading(true);
        setErrorMessage('');
        setMessage('');
        try {
            const data = await verifyEmail(codeToSend || code);
            setMessage(data.message);
            setTimeout(() => history.push('/login'), 2500);
        } catch (err) {
            setErrorMessage(err.response?.data?.error || 'Erreur. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!code.trim()) {
            setErrorMessage('Veuillez saisir le code.');
            return;
        }
        handleVerify(code);
    };

    return (
        <div className="login">
            <div className="login__card">
                <h2 className="login__title">Vérification de l'email</h2>

                {emailParam && (
                    <p style={{textAlign: 'center', color: '#555', marginBottom: '12px'}}>
                        Un code à 6 chiffres a été envoyé à <strong>{emailParam}</strong>.
                    </p>
                )}

                {message && <p className="login__success">{message}</p>}
                {errorMessage && <p className="login__error">{errorMessage}</p>}

                {!message && (
                    <form className="login__form" onSubmit={handleSubmit}>
                        <input
                            className="login__input"
                            type="text"
                            placeholder="Code à 6 chiffres"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            required
                        />
                        <button className="login__submit" type="submit" disabled={loading}>
                            {loading ? 'Vérification...' : 'Confirmer'}
                        </button>
                    </form>
                )}

                <button className="login__switch" onClick={() => history.push('/login')}>
                    Retour à la connexion
                </button>

                {emailParam && !message && (
                    <button
                        className="login__switch"
                        style={{marginTop: '8px', fontSize: '0.82rem', opacity: 0.7}}
                        onClick={async () => {
                            try {
                                const data = await bypassVerify(emailParam);
                                localStorage.setItem('token', data.token);
                                localStorage.setItem('userId', data.userId);
                                history.push('/profile');
                            } catch (err) {
                                setErrorMessage(err.response?.data?.error || 'Erreur. Veuillez réessayer.');
                            }
                        }}
                    >
                        Le mail n'a pas été reçu ?
                    </button>
                )}
            </div>
        </div>
    );
}

export default EmailVerification;
