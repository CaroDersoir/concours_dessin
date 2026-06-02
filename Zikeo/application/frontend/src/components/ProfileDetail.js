// Composant formulaire de profil utilisateur connecté
import '../styles/ProfileDetail.css';
import {useEffect, useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {getProfile, updateProfile, deleteMyAccount} from '../service/customerServiceFront';
import {LanguageContext} from '../context/languageContext';

function ProfileDetail() {
    const {t} = useContext(LanguageContext);
    const history = useHistory();
    const token = localStorage.getItem('token');

    const [form, setForm] = useState({
        nom: '', prenom: '', email: '',
        adresse: '', telephone: '',
        adresse_livraison: '', preferences_paiement: '',
        password: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (!token) {
            history.push('/login');
            return;
        }
        getProfile()
            .then(data => setForm(prev => ({
                ...prev,
                nom: data.nom || '',
                prenom: data.prenom || '',
                email: data.email || '',
                adresse: data.adresse || '',
                telephone: data.telephone || '',
                adresse_livraison: data.adresse_livraison || '',
                preferences_paiement: data.preferences_paiement || ''
            })))
            .catch(() => setErrorMessage(t('profile_error_load')));
    }, [token, history]);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteMyAccount();
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('isAdmin');
            history.push('/login');
        } catch {
            setErrorMessage(t('profile_error_delete'));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        const body = {...form};
        if (!body.password) delete body.password;

        try {
            await updateProfile(body);
            setSuccessMessage(t('profile_success_save'));
        } catch (error) {
            setErrorMessage(error.response?.data?.error || t('profile_error_save'));
        }
    };

    return (
        <div className="profile">
            <div className="profile__card">
                <div className="profile__header">
                    <h2 className="profile__title">{t('profile_title_card')}</h2>
                </div>

                {successMessage && <p className="profile__success">{successMessage}</p>}
                {errorMessage && <p className="profile__error">{errorMessage}</p>}

                <form className="profile__form" onSubmit={handleSave}>
                    <div className="profile__row">
                        <div className="profile__field">
                            <label className="profile__label">{t('profile_label_prenom')}</label>
                            <input
                                className="profile__input"
                                name="prenom"
                                value={form.prenom}
                                onChange={handleChange}
                                placeholder={t('profile_label_prenom')}
                            />
                        </div>
                        <div className="profile__field">
                            <label className="profile__label">{t('profile_label_nom')}</label>
                            <input
                                className="profile__input"
                                name="nom"
                                value={form.nom}
                                onChange={handleChange}
                                placeholder={t('profile_label_nom')}
                            />
                        </div>
                    </div>

                    <div className="profile__field">
                        <label className="profile__label">{t('profile_label_email')}</label>
                        <input
                            className="profile__input"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="profile__field">
                        <label className="profile__label">{t('profile_label_password')}</label>
                        <input
                            className="profile__input"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder={t('profile_placeholder_password')}
                        />
                    </div>

                    <div className="profile__field">
                        <label className="profile__label">{t('profile_label_telephone')}</label>
                        <input
                            className="profile__input"
                            name="telephone"
                            value={form.telephone}
                            onChange={handleChange}
                            placeholder={t('profile_placeholder_telephone')}
                        />
                    </div>

                    <div className="profile__field">
                        <label className="profile__label">{t('profile_label_adresse')}</label>
                        <input
                            className="profile__input"
                            name="adresse"
                            value={form.adresse}
                            onChange={handleChange}
                            placeholder={t('profile_label_adresse')}
                        />
                    </div>

                    <div className="profile__field">
                        <label className="profile__label">{t('profile_label_adresse_livraison')}</label>
                        <input
                            className="profile__input"
                            name="adresse_livraison"
                            value={form.adresse_livraison}
                            onChange={handleChange}
                            placeholder={t('profile_placeholder_adresse_livraison')}
                        />
                    </div>

                    <div className="profile__field">
                        <label className="profile__label">{t('profile_label_paiement')}</label>
                        <select
                            className="profile__input profile__select"
                            name="preferences_paiement"
                            value={form.preferences_paiement}
                            onChange={handleChange}
                        >
                            <option value="">{t('profile_paiement_choose')}</option>
                            <option value="carte">{t('profile_paiement_carte')}</option>
                            <option value="paypal">{t('profile_paiement_paypal')}</option>
                            <option value="virement">{t('profile_paiement_virement')}</option>
                        </select>
                    </div>

                    <button className="profile__submit" type="submit">{t('item_edit_btn_save')}</button>
                </form>

                <div className="profile__danger">
                    {!confirmDelete ? (
                        <button className="profile__delete-btn" onClick={() => setConfirmDelete(true)}>
                            {t('profile_delete_account')}
                        </button>
                    ) : (
                        <div className="profile__delete-confirm">
                            <p className="profile__delete-warning">{t('profile_delete_confirm')}</p>
                            <div className="profile__delete-actions">
                                <button className="profile__delete-btn" onClick={handleDeleteAccount}>
                                    {t('profile_delete_confirm_yes')}
                                </button>
                                <button className="profile__submit" onClick={() => setConfirmDelete(false)}>
                                    {t('profile_delete_confirm_no')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default ProfileDetail;
