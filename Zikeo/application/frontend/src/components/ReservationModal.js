// Modal de réservation du local avec gestion des règles et dérogation
import { useState, useContext } from 'react';
import { createReservation } from '../service/reservationServiceFront';
import { LanguageContext } from '../context/languageContext';
import '../styles/Planning.css';

function ReservationModal({ onClose, onSuccess }) {
    const { t } = useContext(LanguageContext);
    const today = new Date().toISOString().split('T')[0];

    const [date, setDate] = useState('');
    const [heureDebut, setHeureDebut] = useState('');
    const [heureFin, setHeureFin] = useState('');
    const [error, setError] = useState(null);
    const [limitWarning, setLimitWarning] = useState(null);
    const [loading, setLoading] = useState(false);

    const limitMessageKey = { weekly: 'modal_resa_limit_weekly', duration: 'modal_resa_limit_duration' };

    const reset = () => { setLimitWarning(null); setError(null); };

    const submit = async (derogation = false) => {
        setError(null);
        setLoading(true);
        try {
            await createReservation({ date, heure_debut: heureDebut, heure_fin: heureFin, derogation });
            onSuccess();
        } catch (err) {
            const data = err.response?.data;
            if (err.response?.status === 409 && data?.limitType) {
                setLimitWarning({ limitType: data.limitType });
            } else {
                setError(data?.error || t('modal_resa_error_generic'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__box" onClick={e => e.stopPropagation()}>
                <h2 className="modal__title">{t('modal_resa_title')}</h2>

                <div className="modal__fields">
                    <label className="modal__label">
                        {t('modal_resa_date')}
                        <input type="date" className="modal__input" value={date} min={today}
                               onChange={e => { setDate(e.target.value); reset(); }}/>
                    </label>
                    <label className="modal__label">
                        {t('modal_resa_start')}
                        <input type="time" className="modal__input" value={heureDebut}
                               onChange={e => { setHeureDebut(e.target.value); reset(); }}/>
                    </label>
                    <label className="modal__label">
                        {t('modal_resa_end')}
                        <input type="time" className="modal__input" value={heureFin}
                               onChange={e => { setHeureFin(e.target.value); reset(); }}/>
                    </label>
                </div>

                {error && <p className="modal__error">{error}</p>}

                {limitWarning ? (
                    <div className="modal__warning">
                        <p>{t(limitMessageKey[limitWarning.limitType])}</p>
                        <div className="modal__actions">
                            <button className="btn--secondary" onClick={() => setLimitWarning(null)}>
                                {t('modal_resa_cancel')}
                            </button>
                            <button className="btn--primary" onClick={() => submit(true)} disabled={loading}>
                                {loading ? t('modal_resa_loading') : t('modal_resa_derogation_btn')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="modal__actions">
                        <button className="btn--secondary" onClick={onClose}>{t('modal_resa_cancel')}</button>
                        <button className="btn--primary" onClick={() => submit(false)} disabled={loading}>
                            {loading ? t('modal_resa_loading') : t('modal_resa_submit')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReservationModal;
