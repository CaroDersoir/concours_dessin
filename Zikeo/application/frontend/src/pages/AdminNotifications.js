// Page admin notifications — dérogations, litiges, formations complètes, créneaux du jour
import {useCallback, useContext, useEffect, useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {getAllLitiges, updateLitigeStatut} from '../service/litigeServiceFront';
import {getAllReservations, getPendingDerogations, updateDerogationStatus} from '../service/reservationServiceFront';
import {getAllLessons} from '../service/lessonServiceFront';
import {LanguageContext} from '../context/languageContext';
import '../styles/AdminNotifications.css';

const LEVEL_KEYS = {
    'débutant': 'lesson_level_debutant',
    'intermédiaire': 'lesson_level_intermediaire',
    'avancé': 'lesson_level_avance'
};

const STATUT_COLORS = {
    ouvert: 'notif__badge--alert',
    en_cours: 'notif__badge--warn',
    resolu: 'notif__badge--ok',
    rejete: 'notif__badge--muted'
};

function userName(row) {
    return row.user_prenom || row.user_nom
        ? `${row.user_prenom || ''} ${row.user_nom || ''}`.trim()
        : row.user_email || '—';
}

function AdminNotifications() {
    const {t} = useContext(LanguageContext);
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    const [litiges, setLitiges] = useState([]);
    const [derogations, setDerogations] = useState([]);
    const [fullLessons, setFullLessons] = useState([]);
    const [todayResa, setTodayResa] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedLitige, setSelectedLitige] = useState(null);

    const load = useCallback(async () => {
        try {
            const [litigesData, derogationsData, lessonsData, resaData] = await Promise.all([
                getAllLitiges(),
                getPendingDerogations(),
                getAllLessons(),
                getAllReservations()
            ]);

            setLitiges(litigesData);
            setDerogations(derogationsData);
            setFullLessons(lessonsData.filter(l => !l.available));

            const today = new Date().toISOString().split('T')[0];
            setTodayResa(
                resaData
                    .filter(r => r.date === today && r.statut !== 'refusee')
                    .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut))
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAdmin) load();
        else setLoading(false);
    }, [isAdmin, load]);

    async function handleDerogation(id, statut) {
        try {
            await updateDerogationStatus(id, statut);
            setFeedback(t('planning_admin_derogation_updated'));
            load();
        } catch {
            setFeedback(t('planning_admin_error'));
        }
    }

    async function handleLitigeStatut(id, statut) {
        try {
            await updateLitigeStatut(id, statut);
            setFeedback(t('notif_litige_updated'));
            load();
        } catch {
            setFeedback(t('planning_admin_error'));
        }
    }

    if (!isAdmin) {
        return (
            <div className="page">
                <Header/>
                <main className="page__content"><p>Accès refusé.</p></main>
                <Footer/>
            </div>
        );
    }

    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <h1 className="page__title">{t('notif_title')}</h1>

                {feedback && (
                    <p className="notif__feedback" onClick={() => setFeedback('')}>{feedback}</p>
                )}

                {/* Cartes de synthèse */}
                {!loading && (
                    <div className="notif__summary">
                        <div
                            className={`notif__card notif__card--alert ${derogations.length === 0 ? 'notif__card--zero' : ''}`}>
                            <span className="notif__card-count">{derogations.length}</span>
                            <span className="notif__card-label">{t('notif_card_derogations')}</span>
                        </div>
                        <div
                            className={`notif__card notif__card--warn ${litiges.filter(l => l.statut === 'ouvert').length === 0 ? 'notif__card--zero' : ''}`}>
                            <span
                                className="notif__card-count">{litiges.filter(l => l.statut === 'ouvert').length}</span>
                            <span className="notif__card-label">{t('notif_card_litiges')}</span>
                        </div>
                        <div
                            className={`notif__card notif__card--info ${fullLessons.length === 0 ? 'notif__card--zero' : ''}`}>
                            <span className="notif__card-count">{fullLessons.length}</span>
                            <span className="notif__card-label">{t('notif_card_formations')}</span>
                        </div>
                        <div
                            className={`notif__card notif__card--today ${todayResa.length === 0 ? 'notif__card--zero' : ''}`}>
                            <span className="notif__card-count">{todayResa.length}</span>
                            <span className="notif__card-label">{t('notif_card_today')}</span>
                        </div>
                    </div>
                )}

                {/* Dérogations */}
                <section className="notif__section">
                    <h2 className="notif__section-title">
                        {t('planning_admin_derogations_title')}
                        {derogations.length > 0 && <span className="notif__section-badge">{derogations.length}</span>}
                    </h2>
                    {loading ? (
                        <p className="notif__empty">{t('planning_loading')}</p>
                    ) : derogations.length === 0 ? (
                        <p className="notif__empty">{t('planning_admin_derogation_empty')}</p>
                    ) : (
                        <div className="notif__table-wrap">
                            <table className="notif__table">
                                <thead>
                                <tr>
                                    <th>{t('notif_col_user')}</th>
                                    <th>{t('detail_date')}</th>
                                    <th>{t('detail_hours')}</th>
                                    <th>{t('detail_motif')}</th>
                                    <th>{t('admin_users_col_actions')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {derogations.map(d => (
                                    <tr key={d.id}>
                                        <td>{userName(d)}</td>
                                        <td>{new Date(d.date + 'T00:00:00').toLocaleDateString('fr-FR', {
                                            weekday: 'short',
                                            day: 'numeric',
                                            month: 'short'
                                        })}</td>
                                        <td className="notif__monospace">{d.heure_debut.slice(0, 5)} – {d.heure_fin.slice(0, 5)}</td>
                                        <td>{d.motif || '—'}</td>
                                        <td className="notif__actions">
                                            <button className="btn notif__btn-sm"
                                                    onClick={() => handleDerogation(d.id, 'approuvee')}>{t('planning_admin_approve')}</button>
                                            <button className="btn btn--ghost notif__btn-sm"
                                                    onClick={() => handleDerogation(d.id, 'refusee')}>{t('planning_admin_reject')}</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Litiges */}
                <section className="notif__section">
                    <h2 className="notif__section-title">
                        {t('notif_section_litiges')}
                        {litiges.filter(l => l.statut === 'ouvert').length > 0 && (
                            <span className="notif__section-badge notif__section-badge--warn">
                                {litiges.filter(l => l.statut === 'ouvert').length} {t('litige_statut_ouvert').toLowerCase()}
                            </span>
                        )}
                    </h2>
                    {loading ? (
                        <p className="notif__empty">{t('planning_loading')}</p>
                    ) : litiges.length === 0 ? (
                        <p className="notif__empty">{t('litige_empty')}</p>
                    ) : (
                        <div className="notif__table-wrap">
                            <table className="notif__table">
                                <thead>
                                <tr>
                                    <th>{t('notif_col_user')}</th>
                                    <th>{t('litige_label_type')}</th>
                                    <th>{t('detail_date')}</th>
                                    <th>{t('litige_label_description')}</th>
                                    <th>{t('notif_col_statut')}</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {litiges.map(l => (
                                    <tr key={l.id} className={l.statut === 'ouvert' ? 'notif__row--highlight' : ''}>
                                        <td>{userName(l)}</td>
                                        <td>
                                            <span className="notif__tag">{t(`litige_type_${l.type}`)}</span>
                                        </td>
                                        <td>{new Date(l.created_at).toLocaleDateString('fr-FR')}</td>
                                        <td className="notif__description" title={l.description}>{l.description}</td>
                                        <td>
                                            <select
                                                className="notif__select"
                                                value={l.statut}
                                                onChange={e => handleLitigeStatut(l.id, e.target.value)}
                                            >
                                                <option value="ouvert">{t('litige_statut_ouvert')}</option>
                                                <option value="en_cours">{t('litige_statut_en_cours')}</option>
                                                <option value="resolu">{t('litige_statut_resolu')}</option>
                                                <option value="rejete">{t('litige_statut_rejete')}</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn--ghost notif__btn-sm"
                                                onClick={() => setSelectedLitige(l)}
                                            >
                                                {t('notif_btn_detail')}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Formations complètes */}
                <section className="notif__section">
                    <h2 className="notif__section-title">
                        {t('notif_section_formations')}
                        {fullLessons.length > 0 && <span
                            className="notif__section-badge notif__section-badge--info">{fullLessons.length}</span>}
                    </h2>
                    {loading ? (
                        <p className="notif__empty">{t('planning_loading')}</p>
                    ) : fullLessons.length === 0 ? (
                        <p className="notif__empty">{t('notif_formations_empty')}</p>
                    ) : (
                        <div className="notif__table-wrap">
                            <table className="notif__table">
                                <thead>
                                <tr>
                                    <th>{t('notif_col_name')}</th>
                                    <th>{t('notif_col_level')}</th>
                                    <th>{t('lesson_modal_salle')}</th>
                                    <th>{t('lesson_modal_spots')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {fullLessons.map(l => (
                                    <tr key={l.id}>
                                        <td><strong>{l.name}</strong></td>
                                        <td>{t(LEVEL_KEYS[l.level] ?? l.level)}</td>
                                        <td>{l.salle}</td>
                                        <td>
                                            <span
                                                className="notif__badge notif__badge--alert">{t('lesson_btn_full')}</span>
                                            <span
                                                className="notif__spots"> ({l.spots} {t('lesson_admin_col_spots')})</span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Créneaux du jour */}
                <section className="notif__section">
                    <h2 className="notif__section-title">
                        {t('notif_section_today')}
                        {todayResa.length > 0 && <span
                            className="notif__section-badge notif__section-badge--today">{todayResa.length}</span>}
                    </h2>
                    {loading ? (
                        <p className="notif__empty">{t('planning_loading')}</p>
                    ) : todayResa.length === 0 ? (
                        <p className="notif__empty">{t('notif_today_empty')}</p>
                    ) : (
                        <div className="notif__table-wrap">
                            <table className="notif__table">
                                <thead>
                                <tr>
                                    <th>{t('notif_col_user')}</th>
                                    <th>{t('detail_hours')}</th>
                                    <th>{t('detail_motif')}</th>
                                    <th>{t('notif_col_derogation')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {todayResa.map(r => (
                                    <tr key={r.id}>
                                        <td>{userName(r)}</td>
                                        <td className="notif__monospace">{r.heure_debut.slice(0, 5)} – {r.heure_fin.slice(0, 5)}</td>
                                        <td>{r.motif || '—'}</td>
                                        <td>
                                            {r.est_derogation
                                                ? <span
                                                    className={`notif__badge ${STATUT_COLORS[r.statut_derogation] || ''}`}>{t(`planning_resa_badge_${r.statut_derogation}`)}</span>
                                                : '—'}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
            <Footer/>

            {/* Modal détail litige */}
            {selectedLitige && (
                <div className="notif__overlay" onClick={() => setSelectedLitige(null)}>
                    <div className="notif__modal" onClick={e => e.stopPropagation()}>
                        <div className="notif__modal-header">
                            <h3 className="notif__modal-title">{t('litige_detail_title')}</h3>
                            <button className="notif__modal-close" onClick={() => setSelectedLitige(null)}>✕</button>
                        </div>
                        <dl className="notif__modal-dl">
                            <dt>{t('notif_col_user')}</dt>
                            <dd>{userName(selectedLitige)}</dd>
                            <dt>{t('litige_label_type')}</dt>
                            <dd><span className="notif__tag">{t(`litige_type_${selectedLitige.type}`)}</span></dd>
                            <dt>{t('detail_date')}</dt>
                            <dd>{new Date(selectedLitige.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}</dd>
                            <dt>{t('notif_col_statut')}</dt>
                            <dd>
                                <span className={`notif__badge ${STATUT_COLORS[selectedLitige.statut] || ''}`}>
                                    {t(`litige_statut_${selectedLitige.statut}`)}
                                </span>
                            </dd>
                            <dt>{t('litige_label_description')}</dt>
                            <dd className="notif__modal-description">{selectedLitige.description || '—'}</dd>
                        </dl>
                        <div className="notif__modal-footer">
                            <select
                                className="notif__select"
                                value={selectedLitige.statut}
                                onChange={async e => {
                                    const newStatut = e.target.value;
                                    await handleLitigeStatut(selectedLitige.id, newStatut);
                                    setSelectedLitige(prev => ({...prev, statut: newStatut}));
                                }}
                            >
                                <option value="ouvert">{t('litige_statut_ouvert')}</option>
                                <option value="en_cours">{t('litige_statut_en_cours')}</option>
                                <option value="resolu">{t('litige_statut_resolu')}</option>
                                <option value="rejete">{t('litige_statut_rejete')}</option>
                            </select>
                            <button className="btn btn--ghost" onClick={() => setSelectedLitige(null)}>
                                {t('detail_close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminNotifications;
