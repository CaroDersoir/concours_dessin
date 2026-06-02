/** catalogue des leçons organisé en deux bulles : Formation musicale / Pratique d'un instrument **/

import { useEffect, useState, useContext } from 'react';
import { getAllLessons } from '../service/lessonServiceFront';
import { getSessionsByLesson } from '../service/lessonSessionServiceFront';
import {LanguageContext} from '../context/languageContext';
import {CurrencyContext} from '../context/currencyContext';
import '../styles/Formations.css';

const LEVEL_KEYS = {
    'débutant': 'lesson_level_debutant',
    'intermédiaire': 'lesson_level_intermediaire',
    'avancé': 'lesson_level_avance'
};

const LEVELS = ['débutant', 'intermédiaire', 'avancé'];

const emptyFilters = { search: '', level: '', maxPrice: '', durationMax: '', availableOnly: false };

function LessonModal({ lesson, onClose, addToCart, t, convert, currency }) {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    useEffect(() => {
        getSessionsByLesson(lesson.id)
            .then(data => setSessions(data.sort((a, b) => a.date.localeCompare(b.date) || a.heure_debut.localeCompare(b.heure_debut))))
            .catch(() => setSessions([]));
    }, [lesson.id]);

    const teacherName = lesson.teacher_prenom || lesson.teacher_nom
        ? `${lesson.teacher_prenom || ''} ${lesson.teacher_nom || ''}`.trim()
        : null;

    return (
        <div className="lesson-modal__overlay" onClick={onClose}>
            <div className="lesson-modal__box" onClick={e => e.stopPropagation()}>
                <div className="lesson-modal__header">
                    <h2 className="lesson-modal__name">{lesson.name}</h2>
                    <span className="lesson-card__level">{t(LEVEL_KEYS[lesson.level] ?? lesson.level)}</span>
                </div>

                <div className="lesson-modal__rows">
                    <div className="lesson-modal__row">
                        <span className="lesson-modal__label">{t('lesson_modal_teacher')}</span>
                        <span className={teacherName ? '' : 'lesson-modal__empty'}>
                            {teacherName || t('lesson_modal_teacher_none')}
                        </span>
                    </div>
                    {lesson.duration_minutes && (
                        <div className="lesson-modal__row">
                            <span className="lesson-modal__label">{t('lesson_modal_duration')}</span>
                            <span>{t('lesson_modal_duration_value', { n: lesson.duration_minutes })}</span>
                        </div>
                    )}
                    <div className="lesson-modal__row">
                        <span className="lesson-modal__label">{t('lesson_modal_spots')}</span>
                        <span>{lesson.spots}</span>
                    </div>
                    <div className="lesson-modal__row">
                        <span className="lesson-modal__label">{t('lesson_modal_salle')}</span>
                        <span>{lesson.salle}</span>
                    </div>
                    {lesson.description && (
                        <p className="lesson-modal__description">{lesson.description}</p>
                    )}

                    <div className="lesson-modal__sessions">
                        <span className="lesson-modal__label">{t('lesson_modal_sessions')}</span>
                        {sessions.length === 0 ? (
                            <span className="lesson-modal__empty">{t('lesson_modal_sessions_empty')}</span>
                        ) : (
                            <ul className="lesson-modal__sessions-list">
                                {sessions.map(s => (
                                    <li key={s.id} className="lesson-modal__session-item">
                                        <span className="lesson-modal__session-date">
                                            {new Date(s.date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        <span className="lesson-modal__session-hours">
                                            {s.heure_debut.slice(0, 5)} – {s.heure_fin.slice(0, 5)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="lesson-modal__footer">
                    <span className="lesson-modal__price">{convert(lesson.price)} {currency.symbol}</span>
                    <div className="lesson-modal__actions">
                        <button className="btn btn--ghost" onClick={onClose}>{t('item_btn_close')}</button>
                        <button
                            className="btn"
                            onClick={() => { addToCart(lesson); onClose(); }}
                            disabled={!lesson.available}
                        >
                            {lesson.available ? t('item_btn_add_cart') : t('lesson_btn_full')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LessonCard({ lesson, addToCart, onSelect, t, convert, currency }) {
    return (
        <div
            className={`lesson-card ${!lesson.available ? 'lesson-card--unavailable' : ''}`}
            onClick={() => onSelect(lesson)}
        >
            <div className="lesson-card__header">
                <span className="lesson-card__name">{lesson.name}</span>
                <span className="lesson-card__level">{t(LEVEL_KEYS[lesson.level] ?? lesson.level)}</span>
            </div>
            {lesson.description && (
                <p className="lesson-card__description">{lesson.description}</p>
            )}
            <div className="lesson-card__footer">
                <span className="lesson-card__price">{convert(lesson.price)} {currency.symbol}</span>
                <button
                    className="btn btn__ghost lesson-card__btn"
                    onClick={(e) => { e.stopPropagation(); addToCart(lesson); }}
                    disabled={!lesson.available}
                >
                    {lesson.available ? t('item_btn_add') : t('lesson_btn_full')}
                </button>
            </div>
        </div>
    );
}

function LessonBubble({ title, icon, lessons, addToCart, onSelect, t, convert, currency }) {
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
                        <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            addToCart={addToCart}
                            onSelect={onSelect}
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

function LessonCatalog({ cart, updateCart }) {
    const {t} = useContext(LanguageContext);
    const {convert, currency} = useContext(CurrencyContext);
    const [lessons, setLessons] = useState([]);
    const [error, setError] = useState('');
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [filters, setFilters] = useState(emptyFilters);

    useEffect(() => {
        getAllLessons()
            .then(setLessons)
            .catch(() => setError(t('lesson_error_load')));
    }, []);

    const addToCart = (lesson) => {
        const existing = cart.find(i => i.id === lesson.id && i._type === 'lesson');
        if (existing) {
            updateCart(cart.map(i =>
                i.id === lesson.id && i._type === 'lesson'
                    ? { ...i, amount: i.amount + 1 }
                    : i
            ));
        } else {
            updateCart([...cart, { ...lesson, _type: 'lesson', amount: 1 }]);
        }
    };

    function setFilter(field, value) {
        setFilters(f => ({ ...f, [field]: value }));
    }

    const filtered = lessons.filter(l => {
        if (filters.search && !l.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (filters.level && l.level !== filters.level) return false;
        if (filters.maxPrice !== '' && l.price > Number(filters.maxPrice)) return false;
        if (filters.durationMax !== '' && l.duration_minutes > Number(filters.durationMax)) return false;
        if (filters.availableOnly && !l.available) return false;
        return true;
    });

    const hasActiveFilters = Object.entries(filters).some(([k, v]) => v !== emptyFilters[k]);

    const theory = filtered.filter(l => l.type === 'theory');
    const instrument = filtered.filter(l => l.type === 'instrument');

    return (
        <div className="lesson-catalog">
            {error && <p className="lesson-catalog__error">{error}</p>}

            <div className="lesson-filters">
                <input
                    className="input lesson-filters__search"
                    placeholder={t('lesson_search_placeholder')}
                    value={filters.search}
                    onChange={e => setFilter('search', e.target.value)}
                />
                <select
                    className="input lesson-filters__select"
                    value={filters.level}
                    onChange={e => setFilter('level', e.target.value)}
                >
                    <option value="">{t('lesson_filter_level_all')}</option>
                    {LEVELS.map(lv => (
                        <option key={lv} value={lv}>{t(LEVEL_KEYS[lv])}</option>
                    ))}
                </select>
                <input
                    className="input lesson-filters__number"
                    type="number"
                    min="0"
                    placeholder={t('lesson_filter_price_max')}
                    value={filters.maxPrice}
                    onChange={e => setFilter('maxPrice', e.target.value)}
                />
                <input
                    className="input lesson-filters__number"
                    type="number"
                    min="0"
                    placeholder={t('lesson_filter_duration_max')}
                    value={filters.durationMax}
                    onChange={e => setFilter('durationMax', e.target.value)}
                />
                <label className="lesson-filters__available">
                    <input
                        type="checkbox"
                        checked={filters.availableOnly}
                        onChange={e => setFilter('availableOnly', e.target.checked)}
                    />
                    {t('lesson_filter_available_only')}
                </label>
                {hasActiveFilters && (
                    <button className="btn btn--ghost lesson-filters__reset" onClick={() => setFilters(emptyFilters)}>
                        {t('lesson_filter_reset')}
                    </button>
                )}
            </div>

            <div className="lesson-catalog__grid">
                <LessonBubble
                    title={t('lesson_bubble_theory')}
                    icon="music_note_2"
                    lessons={theory}
                    addToCart={addToCart}
                    onSelect={setSelectedLesson}
                    t={t}
                    convert={convert}
                    currency={currency}
                />
                <LessonBubble
                    title={t('lesson_bubble_instrument')}
                    icon="piano"
                    lessons={instrument}
                    addToCart={addToCart}
                    onSelect={setSelectedLesson}
                    t={t}
                    convert={convert}
                    currency={currency}
                />
            </div>

            {selectedLesson && (
                <LessonModal
                    lesson={selectedLesson}
                    onClose={() => setSelectedLesson(null)}
                    addToCart={addToCart}
                    t={t}
                    convert={convert}
                    currency={currency}
                />
            )}
        </div>
    );
}

export default LessonCatalog;
