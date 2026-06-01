// Composant formulaire de profil utilisateur connecté
import '../styles/ProfileDetail.css';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {getProfile, updateProfile} from '../service/customerServiceFront';

function ProfileDetail() {
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
            .catch(() => setErrorMessage('Erreur lors du chargement du profil.'));
    }, [token, history]);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        const body = {...form};
        if (!body.password) delete body.password;

        try {
            await updateProfile(body);
            setSuccessMessage('Profil mis à jour avec succès.');
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'Erreur lors de la mise à jour.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        history.push('/login');
    };

    return (
        <div className="profile">
            <div className="profile__card">
                <div className="profile__header">
                    <h2 className="profile__title">Mon Profil</h2>
                </div>

                {successMessage && <p className="profile__success">{successMessage}</p>}
                {errorMessage && <p className="profile__error">{errorMessage}</p>}

                <form className="profile__form" onSubmit={handleSave}>
                    <div className="profile__row">
                        <div className="profile__field">
                            <label className="profile__label">Prénom</label>
                            <input
                                className="profile__input"
                                name="prenom"
                                value={form.prenom}
                                onChange={handleChange}
                                placeholder="Prénom"
                            />
                        </div>
                        <div className="profile__field">
                            <label className="profile__label">Nom</label>
                            <input
                                className="profile__input"
                                name="nom"
                                value={form.nom}
                                onChange={handleChange}
                                placeholder="Nom"
                            />
                        </div>
                    </div>

                    <div className="profile__field">
                        <label className="profile__label">Email *</label>
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
                        <label className="profile__label">Nouveau mot de passe</label>
                        <input
                            className="profile__input"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Laisser vide pour ne pas changer"
                        />
                    </div>

                    <div className="profile__field">
                        <label className="profile__label">Téléphone</label>
                        <input
                            className="profile__input"
                            name="telephone"
                            value={form.telephone}
                            onChange={handleChange}
                            placeholder="Numéro de téléphone"
                        />
                    </div>

                    <div className="profile__field">
                        <label className="profile__label">Adresse</label>
                        <input
                            className="profile__input"
                            name="adresse"
                            value={form.adresse}
                            onChange={handleChange}
                            placeholder="Adresse"
                        />
                    </div>

                    <div className="profile__field">
                        <label className="profile__label">Adresse de livraison</label>
                        <input
                            className="profile__input"
                            name="adresse_livraison"
                            value={form.adresse_livraison}
                            onChange={handleChange}
                            placeholder="Adresse de livraison (si différente)"
                        />
                    </div>

                    <div className="profile__field">
                        <label className="profile__label">Préférences de paiement</label>
                        <select
                            className="profile__input profile__select"
                            name="preferences_paiement"
                            value={form.preferences_paiement}
                            onChange={handleChange}
                        >
                            <option value="">-- Choisir --</option>
                            <option value="carte">Carte bancaire</option>
                            <option value="paypal">PayPal</option>
                            <option value="virement">Virement bancaire</option>
                        </select>
                    </div>

                    <button className="profile__submit" type="submit">Enregistrer</button>
                </form>

                <button className="profile__logout" onClick={handleLogout}>Déconnexion</button>
            </div>
        </div>
    );
}

export default ProfileDetail;