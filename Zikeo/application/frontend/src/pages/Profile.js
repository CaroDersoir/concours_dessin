// Page profil — accès aux informations personnelles, litiges et historique des commandes
import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileDetail from '../components/ProfileDetail';
import LitigeDetail from '../components/LitigeDetail';
import OrderHistory from '../components/OrderHistory';
import { LanguageContext } from '../context/languageContext';

function Profile() {
    const { t } = useContext(LanguageContext);
    const history = useHistory();
    const [active, setActive] = useState(null);

    function toggle(section) {
        setActive(prev => prev === section ? null : section);
    }

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
        history.push('/login');
    }

    return (
        <div className="page">
            <Header />
            <main className="page__content">
                <div className="profile__hub">
                    <div className="profile__bubbles">
                        <button
                            className={`profile__bubble${active === 'infos' ? ' profile__bubble--active' : ''}`}
                            onClick={() => toggle('infos')}
                        >
                            <span className="profile__bubble__icon">👤</span>
                            <span className="profile__bubble__label">{t('profile_section_infos')}</span>
                        </button>
                        <button
                            className={`profile__bubble${active === 'litiges' ? ' profile__bubble--active' : ''}`}
                            onClick={() => toggle('litiges')}
                        >
                            <span className="profile__bubble__icon">⚠️</span>
                            <span className="profile__bubble__label">{t('profile_section_litiges')}</span>
                        </button>
                        <button
                            className={`profile__bubble${active === 'commandes' ? ' profile__bubble--active' : ''}`}
                            onClick={() => toggle('commandes')}
                        >
                            <span className="profile__bubble__icon">📦</span>
                            <span className="profile__bubble__label">{t('profile_section_commandes')}</span>
                        </button>
                    </div>

                    <button className="profile__logout" onClick={handleLogout}>
                        {t('profile_logout')}
                    </button>

                    {active === 'infos' && <ProfileDetail />}
                    {active === 'litiges' && <LitigeDetail />}
                    {active === 'commandes' && <OrderHistory />}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Profile;
