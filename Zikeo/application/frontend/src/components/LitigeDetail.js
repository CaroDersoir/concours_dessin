// Composant formulaire de déclaration et suivi des litiges
import '../styles/Litige.css';
import {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {createLitige, getAllLitiges, getLitiges, updateLitigeStatut} from '../service/litigeServiceFront';
import {LanguageContext} from '../context/languageContext';

const STATUT_CLASS = {
    ouvert: 'litige__badge--ouvert',
    en_cours: 'litige__badge--en_cours',
    resolu: 'litige__badge--resolu',
    rejete: 'litige__badge--rejete',
};

function LitigeDetail() {
    const {t} = useContext(LanguageContext);
    const history = useHistory();
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    const [form, setForm] = useState({commande_ref: '', type: 'livraison', description: ''});
    const [litiges, setLitiges] = useState([]);
    const [allLitiges, setAllLitiges] = useState([]);
    const [selectedLitige, setSelectedLitige] = useState(null);
    const [modalStatut, setModalStatut] = useState('');
    const [modalFeedback, setModalFeedback] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const loadAllLitiges = () =>
        getAllLitiges().then(setAllLitiges).catch(() => {
        });

    useEffect(() => {
        if (!token) {
            history.push('/login');
            return;
        }
        getLitiges()
            .then(setLitiges)
            .catch(() => setErrorMessage(t('litige_error_load')));
        if (isAdmin) loadAllLitiges();
    }, [token, history]);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setLoading(true);

        try {
            const created = await createLitige(form);
            setLitiges([created, ...litiges]);
            setForm({commande_ref: '', type: 'livraison', description: ''});
            setSuccessMessage(t('litige_success'));
        } catch (err) {
            setErrorMessage(err.response?.data?.error || t('litige_error_submit'));
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (litige) => {
        setSelectedLitige(litige);
        setModalStatut(litige.statut);
        setModalFeedback('');
    };

    const handleSaveStatut = async () => {
        try {
            await updateLitigeStatut(selectedLitige.id, modalStatut);
            setModalFeedback(t('notif_litige_updated'));
            setAllLitiges(allLitiges.map(l => l.id === selectedLitige.id ? {...l, statut: modalStatut} : l));
            setSelectedLitige(prev => ({...prev, statut: modalStatut}));
        } catch {
            setModalFeedback(t('litige_error_submit'));
        }
    };

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'});

    const activeLitiges = litiges.filter(l => l.statut === 'ouvert' || l.statut === 'en_cours');
    const historyLitiges = litiges.filter(l => l.statut === 'resolu' || l.statut === 'rejete');

    const renderLitigeItem = (l) => (
        <div key={l.id} className="litige__item">
            <div className="litige__item__header">
                <span className="litige__item__type">{t(`litige_type_${l.type}`)}</span>
                <span className={`litige__badge ${STATUT_CLASS[l.statut]}`}>
                    {t(`litige_statut_${l.statut}`)}
                </span>
            </div>
            {l.commande_ref && (
                <p className="litige__item__ref">{t('litige_label_ref')} : {l.commande_ref}</p>
            )}
            <p className="litige__item__desc">{l.description}</p>
            <p className="litige__item__date">{formatDate(l.created_at)}</p>
        </div>
    );

    return (
        <div className="litige">
            <div className="litige__card">
                <h2 className="litige__title">{t('litige_form_title')}</h2>

                {successMessage && <p className="litige__success">{successMessage}</p>}
                {errorMessage && <p className="litige__error">{errorMessage}</p>}

                <form className="litige__form" onSubmit={handleSubmit}>
                    <div className="litige__field">
                        <label className="litige__label">{t('litige_label_type')}</label>
                        <select
                            className="litige__select"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="livraison">{t('litige_type_livraison')}</option>
                            <option value="qualite">{t('litige_type_qualite')}</option>
                            <option value="paiement">{t('litige_type_paiement')}</option>
                            <option value="autre">{t('litige_type_autre')}</option>
                        </select>
                    </div>

                    <div className="litige__field">
                        <label className="litige__label">{t('litige_label_ref')}</label>
                        <input
                            className="litige__input"
                            name="commande_ref"
                            value={form.commande_ref}
                            onChange={handleChange}
                            placeholder={t('litige_placeholder_ref')}
                        />
                    </div>

                    <div className="litige__field">
                        <label className="litige__label">{t('litige_label_description')}</label>
                        <textarea
                            className="litige__textarea"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder={t('litige_placeholder_description')}
                            required
                            minLength={10}
                        />
                    </div>

                    <button className="litige__submit" type="submit" disabled={loading}>
                        {loading ? '...' : t('litige_btn_submit')}
                    </button>
                </form>
            </div>

            <div className="litige__history">
                <h3 className="litige__history__title">{t('litige_active_title')}</h3>
                {activeLitiges.length === 0 ? (
                    <p className="litige__empty">{t('litige_active_empty')}</p>
                ) : (
                    activeLitiges.map(renderLitigeItem)
                )}
            </div>

            {historyLitiges.length > 0 && (
                <div className="litige__history">
                    <h3 className="litige__history__title">{t('litige_history_title')}</h3>
                    {historyLitiges.map(renderLitigeItem)}
                </div>
            )}
            {isAdmin && (
                <div className="litige__admin">
                    <h3 className="litige__history__title">{t('litige_admin_title')}</h3>
                    {allLitiges.length === 0 ? (
                        <p className="litige__empty">{t('litige_admin_empty')}</p>
                    ) : (
                        allLitiges.map(l => (
                            <div
                                key={l.id}
                                className="litige__item litige__item--clickable"
                                onClick={() => handleOpenModal(l)}
                            >
                                <div className="litige__item__header">
                                    <span className="litige__item__type">{t(`litige_type_${l.type}`)}</span>
                                    <span className={`litige__badge ${STATUT_CLASS[l.statut]}`}>
                                        {t(`litige_statut_${l.statut}`)}
                                    </span>
                                </div>
                                <p className="litige__item__ref">
                                    {l.user_prenom || l.user_nom
                                        ? `${l.user_prenom || ''} ${l.user_nom || ''}`.trim()
                                        : l.user_email}
                                </p>
                                <p className="litige__item__desc">{l.description}</p>
                                <p className="litige__item__date">{formatDate(l.created_at)}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {selectedLitige && (
                <div className="litige__modal-overlay" onClick={() => setSelectedLitige(null)}>
                    <div className="litige__modal" onClick={e => e.stopPropagation()}>
                        <h2 className="litige__modal-title">{t('litige_detail_title')}</h2>

                        <div className="litige__modal-rows">
                            <div className="litige__modal-row">
                                <span className="litige__modal-label">{t('litige_modal_user')}</span>
                                <span>
                                    {selectedLitige.user_prenom || selectedLitige.user_nom
                                        ? `${selectedLitige.user_prenom || ''} ${selectedLitige.user_nom || ''}`.trim()
                                        : selectedLitige.user_email}
                                </span>
                            </div>
                            <div className="litige__modal-row">
                                <span className="litige__modal-label">{t('litige_label_type')}</span>
                                <span>{t(`litige_type_${selectedLitige.type}`)}</span>
                            </div>
                            {selectedLitige.commande_ref && (
                                <div className="litige__modal-row">
                                    <span className="litige__modal-label">{t('litige_label_ref')}</span>
                                    <span>{selectedLitige.commande_ref}</span>
                                </div>
                            )}
                            <div className="litige__modal-row litige__modal-row--desc">
                                <span className="litige__modal-label">{t('litige_label_description')}</span>
                                <span>{selectedLitige.description}</span>
                            </div>
                            <div className="litige__modal-row">
                                <span className="litige__modal-label">{t('detail_date')}</span>
                                <span>{formatDate(selectedLitige.created_at)}</span>
                            </div>
                            <div className="litige__modal-row">
                                <span className="litige__modal-label">{t('litige_modal_statut')}</span>
                                <select
                                    className="litige__modal-select"
                                    value={modalStatut}
                                    onChange={e => setModalStatut(e.target.value)}
                                >
                                    {['ouvert', 'en_cours', 'resolu', 'rejete'].map(s => (
                                        <option key={s} value={s}>{t(`litige_statut_${s}`)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {modalFeedback && (
                            <p className={modalFeedback === t('notif_litige_updated') ? 'litige__success' : 'litige__error'}>
                                {modalFeedback}
                            </p>
                        )}

                        <div className="litige__modal-actions">
                            <button className="litige__modal-btn litige__modal-btn--secondary"
                                    onClick={() => setSelectedLitige(null)}>
                                {t('detail_close')}
                            </button>
                            <button className="litige__modal-btn litige__modal-btn--primary" onClick={handleSaveStatut}>
                                {t('litige_modal_save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LitigeDetail;
