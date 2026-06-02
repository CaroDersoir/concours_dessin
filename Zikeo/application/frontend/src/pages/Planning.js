// Page agenda — affiche les séances de formations et les réservations du local
import {useCallback, useContext, useEffect, useState} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReservationModal from '../components/ReservationModal';
import {
    adminDeleteReservation,
    adminUpdateReservation,
    cancelReservation,
    getAllReservations,
    getPendingDerogations,
    updateDerogationStatus
} from '../service/reservationServiceFront';
import {getAllSessions} from '../service/lessonSessionServiceFront';
import {LanguageContext} from '../context/languageContext';
import '../styles/Planning.css';

moment.locale('fr');
const localizer = momentLocalizer(moment);

function Planning() {
    const {t} = useContext(LanguageContext);
    const userId = Number(localStorage.getItem('userId'));
    const isLoggedIn = !!localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [calView, setCalView] = useState('month');
    const [calDate, setCalDate] = useState(new Date());
    const [derogations, setDerogations] = useState([]);
    const [adminFeedback, setAdminFeedback] = useState('');
    const [myReservations, setMyReservations] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({date: '', heure_debut: '', heure_fin: '', motif: ''});

    const calendarMessages = {
        today: t('planning_cal_today'),
        previous: t('planning_cal_prev'),
        next: t('planning_cal_next'),
        month: t('planning_cal_month'),
        week: t('planning_cal_week'),
        day: t('planning_cal_day'),
        noEventsInRange: t('planning_cal_no_events'),
    };

    const loadData = useCallback(async () => {
        try {
            const [reservations, sessions] = await Promise.all([getAllReservations(), getAllSessions()]);

            const sessionEvents = sessions.map(s => ({
                id: `session-${s.id}`,
                title: s.lesson ? s.lesson.name : t('planning_event_formation'),
                start: new Date(`${s.date}T${s.heure_debut}`),
                end: new Date(`${s.date}T${s.heure_fin}`),
                type: 'formation'
            }));

            const reservationEvents = reservations
                .filter(r => r.statut !== 'refusee')
                .map(r => {
                    const isMine = r.user_id === userId;
                    const isPending = r.est_derogation && r.statut_derogation === 'en_attente';
                    const type = isPending ? 'derogation' : (isMine ? 'mine' : 'other');
                    const titleKey = isPending
                        ? 'planning_event_derogation'
                        : (isMine ? 'planning_event_mine' : 'planning_event_other');
                    return {
                        id: `resa-${r.id}`,
                        title: t(titleKey),
                        start: new Date(`${r.date}T${r.heure_debut}`),
                        end: new Date(`${r.date}T${r.heure_fin}`),
                        type,
                        rawData: r
                    };
                });

            setEvents([...sessionEvents, ...reservationEvents]);
            if (isLoggedIn) setMyReservations(reservations.filter(r => r.user_id === userId));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userId, isLoggedIn, t]);

    const loadDerogations = useCallback(async () => {
        if (!isAdmin) return;
        try {
            const data = await getPendingDerogations();
            setDerogations(data);
        } catch {
            setDerogations([]);
        }
    }, [isAdmin]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        loadDerogations();
    }, [loadDerogations]);

    function startEdit() {
        const r = selectedEvent.rawData;
        setEditForm({
            date: r.date,
            heure_debut: r.heure_debut.slice(0, 5),
            heure_fin: r.heure_fin.slice(0, 5),
            motif: r.motif || ''
        });
        setEditMode(true);
    }

    async function handleAdminUpdate() {
        setAdminFeedback('');
        try {
            await adminUpdateReservation(selectedEvent.rawData.id, {
                date: editForm.date,
                heure_debut: editForm.heure_debut,
                heure_fin: editForm.heure_fin,
                motif: editForm.motif || null
            });
            setEditMode(false);
            setSelectedEvent(null);
            setAdminFeedback(t('planning_admin_saved'));
            await loadData();
            await loadDerogations();
        } catch {
            setAdminFeedback(t('planning_admin_error'));
        }
    }

    async function handleAdminDelete(id) {
        setAdminFeedback('');
        try {
            await adminDeleteReservation(id);
            setSelectedEvent(null);
            setAdminFeedback(t('planning_admin_deleted'));
            await loadData();
            await loadDerogations();
        } catch {
            setAdminFeedback(t('planning_admin_error'));
        }
    }

    async function handleCancel(id) {
        try {
            await cancelReservation(id);
            await loadData();
        } catch {
            // silence
        }
    }

    async function handleDerogation(id, statut) {
        setAdminFeedback('');
        try {
            await updateDerogationStatus(id, statut);
            setAdminFeedback(t('planning_admin_derogation_updated'));
            await loadDerogations();
            await loadData();
        } catch {
            setAdminFeedback(t('planning_admin_error'));
        }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingResa = myReservations
        .filter(r => r.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date) || a.heure_debut.localeCompare(b.heure_debut));
    const pastResa = myReservations
        .filter(r => r.date < todayStr)
        .sort((a, b) => b.date.localeCompare(a.date) || b.heure_debut.localeCompare(a.heure_debut));

    const eventStyleGetter = (event) => {
        const colors = {
            formation: '#5c6bc0',
            mine: '#388e3c',
            derogation: '#f57c00',
            other: '#78909c'
        };
        return {
            style: {
                backgroundColor: colors[event.type] || '#78909c',
                borderRadius: '4px',
                color: '#fff',
                border: 'none'
            }
        };
    };

    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <div className="planning__header">
                    <h1 className="page__title">{t('planning_title')}</h1>
                    {isLoggedIn && (
                        <button className="planning__btn-reserver" onClick={() => setShowModal(true)}>
                            {t('planning_btn_reserver')}
                        </button>
                    )}
                </div>

                <div className="planning__legend">
                    <span className="legend__item"><span className="legend__dot"
                                                         style={{background: '#5c6bc0'}}/> {t('planning_legend_formation')}</span>
                    <span className="legend__item"><span className="legend__dot"
                                                         style={{background: '#388e3c'}}/> {t('planning_legend_mine')}</span>
                    <span className="legend__item"><span className="legend__dot"
                                                         style={{background: '#f57c00'}}/> {t('planning_legend_derogation')}</span>
                    <span className="legend__item"><span className="legend__dot"
                                                         style={{background: '#78909c'}}/> {t('planning_legend_other')}</span>
                </div>

                {loading ? (
                    <p className="planning__loading">{t('planning_loading')}</p>
                ) : (
                    <div className="planning__calendar">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            view={calView}
                            date={calDate}
                            onView={setCalView}
                            onNavigate={setCalDate}
                            onDrillDown={(date) => {
                                setCalDate(date);
                                setCalView('day');
                            }}
                            selectable
                            onSelectSlot={({start, action}) => {
                                if (action === 'click' && calView === 'month') {
                                    setCalDate(start);
                                    setCalView('day');
                                }
                            }}
                            views={['month', 'week', 'day']}
                            messages={calendarMessages}
                            eventPropGetter={eventStyleGetter}
                            onSelectEvent={event => setSelectedEvent(event)}
                            style={{height: 650}}
                        />
                    </div>
                )}

                {showModal && (
                    <ReservationModal
                        onClose={() => setShowModal(false)}
                        onSuccess={() => {
                            setShowModal(false);
                            loadData();
                        }}
                    />
                )}

                {selectedEvent && (
                    <div className="modal__overlay" onClick={() => {
                        setSelectedEvent(null);
                        setEditMode(false);
                    }}>
                        <div className="modal__box planning__detail" onClick={e => e.stopPropagation()}>
                            <h2 className="modal__title">{selectedEvent.title}</h2>
                            {editMode ? (
                                <div className="planning__detail__rows">
                                    <div className="planning__detail__row">
                                        <label className="planning__detail__label">{t('detail_date')}</label>
                                        <input type="date" className="planning__edit__input" value={editForm.date}
                                               onChange={e => setEditForm(f => ({...f, date: e.target.value}))}/>
                                    </div>
                                    <div className="planning__detail__row">
                                        <label className="planning__detail__label">{t('modal_resa_start')}</label>
                                        <input type="time" className="planning__edit__input"
                                               value={editForm.heure_debut}
                                               onChange={e => setEditForm(f => ({...f, heure_debut: e.target.value}))}/>
                                    </div>
                                    <div className="planning__detail__row">
                                        <label className="planning__detail__label">{t('modal_resa_end')}</label>
                                        <input type="time" className="planning__edit__input" value={editForm.heure_fin}
                                               onChange={e => setEditForm(f => ({...f, heure_fin: e.target.value}))}/>
                                    </div>
                                    <div className="planning__detail__row">
                                        <label className="planning__detail__label">{t('detail_motif')}</label>
                                        <input type="text" className="planning__edit__input" value={editForm.motif}
                                               onChange={e => setEditForm(f => ({...f, motif: e.target.value}))}/>
                                    </div>
                                </div>
                            ) : (
                                <div className="planning__detail__rows">
                                    <div className="planning__detail__row">
                                        <span className="planning__detail__label">{t('detail_date')}</span>
                                        <span>{selectedEvent.start.toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                    <div className="planning__detail__row">
                                        <span className="planning__detail__label">{t('detail_hours')}</span>
                                        <span>{selectedEvent.start.toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })} – {selectedEvent.end.toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                    </div>
                                    {selectedEvent.rawData && (
                                        <>
                                            <div className="planning__detail__row">
                                                <span
                                                    className="planning__detail__label">{t('detail_reserved_by')}</span>
                                                <span>
                                                    {selectedEvent.rawData.user_prenom || selectedEvent.rawData.user_nom
                                                        ? `${selectedEvent.rawData.user_prenom || ''} ${selectedEvent.rawData.user_nom || ''}`.trim()
                                                        : selectedEvent.rawData.user_email || t('detail_unknown')}
                                                </span>
                                            </div>
                                            {selectedEvent.rawData.motif && (
                                                <div className="planning__detail__row planning__detail__row--motif">
                                                    <span className="planning__detail__label">{t('detail_motif')}</span>
                                                    <span>{selectedEvent.rawData.motif}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                            <div className="modal__actions">
                                {isAdmin && selectedEvent.rawData && (
                                    editMode ? (
                                        <>
                                            <button className="btn"
                                                    onClick={handleAdminUpdate}>{t('planning_admin_save')}</button>
                                            <button className="btn--secondary"
                                                    onClick={() => setEditMode(false)}>{t('modal_resa_cancel')}</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn--ghost"
                                                    onClick={startEdit}>{t('planning_admin_edit')}</button>
                                            <button className="planning__btn-admin-delete"
                                                    onClick={() => handleAdminDelete(selectedEvent.rawData.id)}>{t('planning_admin_delete')}</button>
                                        </>
                                    )
                                )}
                                {!editMode && <button className="btn--secondary"
                                                      onClick={() => setSelectedEvent(null)}>{t('detail_close')}</button>}
                            </div>
                        </div>
                    </div>
                )}

                {isLoggedIn && !loading && (
                    <section className="planning__dashboard">
                        <h2 className="planning__dashboard-title">{t('planning_dashboard_title')}</h2>
                        <div className="planning__dashboard-cols">
                            <div className="planning__dashboard-col">
                                <h3 className="planning__dashboard-subtitle">{t('planning_dashboard_upcoming')}</h3>
                                {upcomingResa.length === 0 ? (
                                    <p className="planning__dashboard-empty">{t('planning_dashboard_upcoming_empty')}</p>
                                ) : (
                                    <ul className="planning__resa-list">
                                        {upcomingResa.map(r => (
                                            <li key={r.id} className="planning__resa-item">
                                                <div className="planning__resa-info">
                                                    <span className="planning__resa-date">
                                                        {new Date(r.date + 'T00:00:00').toLocaleDateString('fr-FR', {
                                                            weekday: 'short',
                                                            day: 'numeric',
                                                            month: 'short'
                                                        })}
                                                    </span>
                                                    <span
                                                        className="planning__resa-hours">{r.heure_debut.slice(0, 5)} – {r.heure_fin.slice(0, 5)}</span>
                                                    {r.est_derogation && (
                                                        <span
                                                            className={`planning__resa-badge planning__resa-badge--${r.statut_derogation}`}>
                                                            {t(`planning_resa_badge_${r.statut_derogation}`)}
                                                        </span>
                                                    )}
                                                </div>
                                                <button className="btn--secondary planning__resa-cancel"
                                                        onClick={() => handleCancel(r.id)}>
                                                    {t('planning_dashboard_cancel')}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="planning__dashboard-col">
                                <h3 className="planning__dashboard-subtitle">{t('planning_dashboard_past')}</h3>
                                {pastResa.length === 0 ? (
                                    <p className="planning__dashboard-empty">{t('planning_dashboard_past_empty')}</p>
                                ) : (
                                    <ul className="planning__resa-list">
                                        {pastResa.map(r => (
                                            <li key={r.id} className="planning__resa-item planning__resa-item--past">
                                                <div className="planning__resa-info">
                                                    <span className="planning__resa-date">
                                                        {new Date(r.date + 'T00:00:00').toLocaleDateString('fr-FR', {
                                                            weekday: 'short',
                                                            day: 'numeric',
                                                            month: 'short'
                                                        })}
                                                    </span>
                                                    <span
                                                        className="planning__resa-hours">{r.heure_debut.slice(0, 5)} – {r.heure_fin.slice(0, 5)}</span>
                                                    {r.est_derogation && r.statut_derogation === 'refusee' && (
                                                        <span
                                                            className="planning__resa-badge planning__resa-badge--refusee">
                                                            {t('planning_resa_badge_refusee')}
                                                        </span>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {isAdmin && (
                    <section className="planning__admin-panel">
                        <h2 className="planning__admin-title">{t('planning_admin_derogations_title')}</h2>
                        {adminFeedback && <p className="planning__admin-feedback">{adminFeedback}</p>}
                        {derogations.length === 0 ? (
                            <p className="planning__admin-empty">{t('planning_admin_derogation_empty')}</p>
                        ) : (
                            <ul className="planning__derogations-list">
                                {derogations.map(d => (
                                    <li key={d.id} className="planning__derogation-item">
                                        <div className="planning__derogation-info">
                                            <strong>
                                                {d.user_prenom || d.user_nom
                                                    ? `${d.user_prenom || ''} ${d.user_nom || ''}`.trim()
                                                    : d.user_email || t('detail_unknown')}
                                            </strong>
                                            <span>{new Date(d.date).toLocaleDateString('fr-FR')} · {d.heure_debut.slice(0, 5)}–{d.heure_fin.slice(0, 5)}</span>
                                            {d.motif && <span className="planning__derogation-motif">{d.motif}</span>}
                                        </div>
                                        <div className="planning__derogation-actions">
                                            <button className="btn"
                                                    onClick={() => handleDerogation(d.id, 'approuvee')}>{t('planning_admin_approve')}</button>
                                            <button className="btn btn--ghost"
                                                    onClick={() => handleDerogation(d.id, 'refusee')}>{t('planning_admin_reject')}</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}
            </main>
            <Footer/>
        </div>
    );
}

export default Planning;
