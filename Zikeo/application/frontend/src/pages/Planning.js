// Page agenda — affiche les séances de formations et les réservations du local
import { useState, useEffect, useCallback, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReservationModal from '../components/ReservationModal';
import { getAllReservations } from '../service/reservationServiceFront';
import { getMySessions } from '../service/lessonSessionServiceFront';
import { LanguageContext } from '../context/languageContext';
import '../styles/Planning.css';

moment.locale('fr');
const localizer = momentLocalizer(moment);

function Planning() {
    const { t } = useContext(LanguageContext);
    const userId = Number(localStorage.getItem('userId'));
    const isLoggedIn = !!localStorage.getItem('token');

    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

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
            const requests = [getAllReservations()];
            if (isLoggedIn) requests.push(getMySessions());
            const [reservations, sessions = []] = await Promise.all(requests);

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
                    const type = isMine ? (isPending ? 'derogation' : 'mine') : 'other';
                    const titleKey = isMine
                        ? (isPending ? 'planning_event_derogation' : 'planning_event_mine')
                        : 'planning_event_other';
                    return {
                        id: `resa-${r.id}`,
                        title: t(titleKey),
                        start: new Date(`${r.date}T${r.heure_debut}`),
                        end: new Date(`${r.date}T${r.heure_fin}`),
                        type
                    };
                });

            setEvents([...sessionEvents, ...reservationEvents]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userId, isLoggedIn, t]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const eventStyleGetter = (event) => {
        const colors = {
            formation: '#5c6bc0',
            mine: '#388e3c',
            derogation: '#f57c00',
            other: '#78909c'
        };
        return { style: { backgroundColor: colors[event.type] || '#78909c', borderRadius: '4px', color: '#fff', border: 'none' } };
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
                    <span className="legend__item"><span className="legend__dot" style={{ background: '#5c6bc0' }}/> {t('planning_legend_formation')}</span>
                    <span className="legend__item"><span className="legend__dot" style={{ background: '#388e3c' }}/> {t('planning_legend_mine')}</span>
                    <span className="legend__item"><span className="legend__dot" style={{ background: '#f57c00' }}/> {t('planning_legend_derogation')}</span>
                    <span className="legend__item"><span className="legend__dot" style={{ background: '#78909c' }}/> {t('planning_legend_other')}</span>
                </div>

                {loading ? (
                    <p className="planning__loading">{t('planning_loading')}</p>
                ) : (
                    <div className="planning__calendar">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            defaultView="month"
                            views={['month', 'week', 'day']}
                            messages={calendarMessages}
                            eventPropGetter={eventStyleGetter}
                            style={{ height: 650 }}
                        />
                    </div>
                )}

                {showModal && (
                    <ReservationModal
                        onClose={() => setShowModal(false)}
                        onSuccess={() => { setShowModal(false); loadData(); }}
                    />
                )}
            </main>
            <Footer/>
        </div>
    );
}

export default Planning;
