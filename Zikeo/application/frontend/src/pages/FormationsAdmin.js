/** Page d'administration des formations : reprend l'affichage public avec boutons d'édition **/

import {useContext, useEffect, useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LessonEdit from '../components/LessonEdit';
import {deleteLesson, getAllLessons} from '../service/lessonServiceFront';
import {getEnrollmentsByLesson} from '../service/lessonEnrollmentServiceFront';
import {LanguageContext} from '../context/languageContext';
import {CurrencyContext} from '../context/currencyContext';
import '../styles/Formations.css';
import '../styles/MerchAdmin.css';

const LEVEL_KEYS = {
    'débutant': 'lesson_level_debutant',
    'intermédiaire': 'lesson_level_intermediaire',
    'avancé': 'lesson_level_avance'
};

function EnrollmentsModal({lesson, onClose, t}) {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getEnrollmentsByLesson(lesson.id)
            .then(setEnrollments)
            .catch(() => setError(t('lesson_admin_enrollments_error')))
            .finally(() => setLoading(false));
    }, [lesson.id]);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div className="merch-admin__modal__overlay" onClick={onClose}>
            <div className="merch-admin__modal__content" onClick={e => e.stopPropagation()}>
                <div className="merch-admin__modal__header">
                    <h2 className="merch-admin__subtitle">{t('lesson_admin_enrollments_title')} — {lesson.name}</h2>
                    <button type="button" className="btn btn__ghost" onClick={onClose}>
                        {t('item_btn_close')}
                    </button>
                </div>

                <div className="merch-admin__modal__body">
                {loading && <p>{t('merch_admin_loading')}</p>}
                {error && <p className="merch-admin__feedback">{error}</p>}

                {!loading && !error && enrollments.length === 0 && (
                    <p className="merch-admin__empty">{t('lesson_admin_enrollments_empty')}</p>
                )}

                {!loading && enrollments.length > 0 && (
                    <ul className="lesson-admin__enrollments-list">
                        {enrollments.map(e => {
                            const name = e.user
                                ? `${e.user.prenom || ''} ${e.user.nom || ''}`.trim() || e.user.email
                                : `#${e.user_id}`;
                            return (
                                <li key={e.id} className="lesson-admin__enrollment-item">
                                    <span className="material-symbols-outlined lesson-admin__enrollment-icon">person</span>
                                    <span>{name}</span>
                                    {e.user?.email && <span className="lesson-admin__enrollment-email">{e.user.email}</span>}
                                </li>
                            );
                        })}
                    </ul>
                )}
                </div>
            </div>
        </div>
    );
}

function LessonCardAdmin({lesson, onEdit, onDelete, onEnrollments, t, convert, currency}) {
    return (
        <div className={`lesson-card ${!lesson.available ? 'lesson-card--unavailable' : ''}`}>
            <div className="lesson-card__header">
                <span className="lesson-card__name">{lesson.name}</span>
                <span className="lesson-card__level">{t(LEVEL_KEYS[lesson.level] ?? lesson.level)}</span>
            </div>
            {lesson.description && (
                <p className="lesson-card__description">{lesson.description}</p>
            )}
            <div className="lesson-card__footer">
                <span className="lesson-card__price">{convert(lesson.price)} {currency.symbol}</span>
                <div className="lesson-card__admin-actions">
                    <button className="btn btn__ghost" onClick={() => onEnrollments(lesson)}>
                        {t('lesson_admin_enrollments_btn')}
                    </button>
                    <button className="btn btn__ghost" onClick={() => onEdit(lesson)}>
                        {t('promo_btn_edit')}
                    </button>
                    <button className="btn btn__ghost" onClick={() => onDelete(lesson.id)}>
                        {t('promo_btn_delete')}
                    </button>
                </div>
            </div>
        </div>
    );
}

function LessonBubbleAdmin({title, icon, lessons, onEdit, onDelete, onEnrollments, t, convert, currency}) {
    return (
        <div className="lesson-bubble">
            <div className="lesson-bubble__header">
                <span className="material-symbols-outlined lesson-bubble__icon">{icon}</span>
                <h2 className="lesson-bubble__title">{title}</h2>
            </div>
            <div className="lesson-bubble__list">
                {lessons.length === 0 ? (
                    <p className="lesson-bubble__empty">{t('lesson_empty')}</p>
                ) : (
                    lessons.map(lesson => (
                        <LessonCardAdmin
                            key={lesson.id}
                            lesson={lesson}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onEnrollments={onEnrollments}
                            t={t}
                            convert={convert}
                            currency={currency}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function FormationsAdmin() {
    const {t} = useContext(LanguageContext);
    const {convert, currency} = useContext(CurrencyContext);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [enrollmentsLesson, setEnrollmentsLesson] = useState(null);

    async function loadLessons() {
        setLoading(true);
        try {
            const data = await getAllLessons();
            setLessons(data);
        } catch {
            setFeedback(t('lesson_admin_error_load'));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadLessons();
    }, []);

    async function handleDelete(id) {
        setFeedback('');
        try {
            await deleteLesson(id);
            await loadLessons();
        } catch (err) {
            setFeedback(err.response?.data?.error || err.message);
        }
    }

    async function handleSaved() {
        setFeedback('');
        await loadLessons();
        setIsModalOpen(false);
        setEditingLesson(null);
    }

    const theory = lessons.filter(l => l.type === 'theory');
    const instrument = lessons.filter(l => l.type === 'instrument');

    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <div className="merch-admin__topbar">
                    <h1 className="page__title">{t('lesson_admin_title')}</h1>
                    <button className="btn" onClick={() => {
                        setEditingLesson(null);
                        setIsModalOpen(true);
                    }}>
                        {t('lesson_admin_btn_add')}
                    </button>
                </div>

                {loading && <p>{t('merch_admin_loading')}</p>}
                {feedback && <p className="merch-admin__feedback">{feedback}</p>}

                <div className="lesson-catalog">
                    <div className="lesson-catalog__grid">
                        <LessonBubbleAdmin
                            title={t('lesson_bubble_theory')}
                            icon="music_note_2"
                            lessons={theory}
                            onEdit={(lesson) => { setEditingLesson(lesson); setIsModalOpen(true); }}
                            onDelete={handleDelete}
                            onEnrollments={setEnrollmentsLesson}
                            t={t}
                            convert={convert}
                            currency={currency}
                        />
                        <LessonBubbleAdmin
                            title={t('lesson_bubble_instrument')}
                            icon="piano"
                            lessons={instrument}
                            onEdit={(lesson) => { setEditingLesson(lesson); setIsModalOpen(true); }}
                            onDelete={handleDelete}
                            onEnrollments={setEnrollmentsLesson}
                            t={t}
                            convert={convert}
                            currency={currency}
                        />
                    </div>
                </div>

                <LessonEdit
                    isOpen={isModalOpen}
                    lesson={editingLesson}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingLesson(null);
                    }}
                    onSaved={handleSaved}
                    t={t}
                />

                {enrollmentsLesson && (
                    <EnrollmentsModal
                        lesson={enrollmentsLesson}
                        onClose={() => setEnrollmentsLesson(null)}
                        t={t}
                    />
                )}
            </main>
            <Footer/>
        </div>
    );
}

export default FormationsAdmin;
