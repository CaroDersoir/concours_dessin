/** Modale de création / modification d'une formation (leçon) **/

import {useEffect, useState} from 'react';
import {createLesson, updateLesson} from '../service/lessonServiceFront';
import {getAllSessions, createSession, deleteSession} from '../service/lessonSessionServiceFront';
import {getAllUsers} from '../service/customerServiceFront';

const TYPES = ['theory', 'instrument'];
const LEVELS = ['débutant', 'intermédiaire', 'avancé'];

const emptyLesson = {
    name: '',
    description: '',
    type: 'theory',
    level: 'débutant',
    price: '',
    available: true,
    teacher_id: '',
    salle: 'local',
    spots: 0
};

const emptySessionForm = { date: '', heure_debut: '', heure_fin: '' };

function LessonEdit({isOpen, lesson, onClose, onSaved, t}) {
    const [formData, setFormData] = useState(emptyLesson);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);

    const [sessions, setSessions] = useState([]);
    const [sessionForm, setSessionForm] = useState(emptySessionForm);
    const [sessionError, setSessionError] = useState('');

    useEffect(() => {
        getAllUsers()
            .then(setUsers)
            .catch(() => {});
    }, []);

    const isCreating = !lesson;

    useEffect(() => {
        if (!isOpen) return;
        setFormData(lesson ? {
            name: lesson.name || '',
            description: lesson.description || '',
            type: lesson.type || 'theory',
            level: lesson.level || 'débutant',
            price: lesson.price ?? '',
            available: lesson.available !== false,
            teacher_id: lesson.teacher_id ?? '',
            salle: lesson.salle || 'local',
            spots: lesson.spots ?? 0
        } : emptyLesson);
        setError('');
        setSessions([]);
        setSessionForm(emptySessionForm);
        setSessionError('');

        if (lesson) {
            getAllSessions()
                .then(all => setSessions(all.filter(s => s.lesson_id === lesson.id)))
                .catch(() => {});
        }
    }, [lesson, isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        const payload = {
            ...formData,
            price: Number(formData.price),
            teacher_id: formData.teacher_id === '' ? null : Number(formData.teacher_id),
            spots: Number(formData.spots)
        };
        try {
            if (isCreating) {
                await createLesson(payload);
            } else {
                await updateLesson(lesson.id, payload);
            }
            onSaved();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    }

    async function handleAddSession(e) {
        e.preventDefault();
        setSessionError('');
        try {
            const created = await createSession({ lesson_id: lesson.id, ...sessionForm });
            setSessions(prev => [...prev, created]);
            setSessionForm(emptySessionForm);
        } catch {
            setSessionError(t('lesson_admin_sessions_error_add'));
        }
    }

    async function handleDeleteSession(id) {
        setSessionError('');
        try {
            await deleteSession(id);
            setSessions(prev => prev.filter(s => s.id !== id));
        } catch {
            setSessionError(t('lesson_admin_sessions_error_delete'));
        }
    }

    function set(field) {
        return (e) => setFormData({...formData, [field]: e.target.value});
    }

    return (
        <div className="merch-admin__modal__overlay" onClick={onClose}>
            <div className="merch-admin__modal__content" onClick={(e) => e.stopPropagation()}>
                <div className="merch-admin__modal__header">
                    <h2 className="merch-admin__subtitle">
                        {isCreating ? t('lesson_admin_modal_title_add') : t('lesson_admin_modal_title_edit')}
                    </h2>
                    <button type="button" className="btn btn__ghost" onClick={onClose}>
                        {t('item_btn_close')}
                    </button>
                </div>

                <div className="merch-admin__modal__body">
                {error && <p className="merch-admin__feedback">{error}</p>}

                <form className="merch-admin__form" onSubmit={handleSubmit}>
                    <input
                        className="input"
                        placeholder={t('lesson_admin_placeholder_name')}
                        value={formData.name}
                        onChange={set('name')}
                        required
                    />
                    <textarea
                        className="input merch-admin__textarea"
                        placeholder={t('lesson_admin_placeholder_desc')}
                        value={formData.description}
                        onChange={set('description')}
                    />
                    <select className="input" value={formData.type} onChange={set('type')}>
                        {TYPES.map((ty) => (
                            <option key={ty} value={ty}>{t('lesson_admin_type_' + ty)}</option>
                        ))}
                    </select>
                    <select className="input" value={formData.level} onChange={set('level')}>
                        {LEVELS.map((lv) => (
                            <option key={lv} value={lv}>{t(
                                lv === 'débutant' ? 'lesson_level_debutant'
                                : lv === 'intermédiaire' ? 'lesson_level_intermediaire'
                                : 'lesson_level_avance'
                            )}</option>
                        ))}
                    </select>
                    <input
                        className="input"
                        type="number"
                        step="0.01"
                        placeholder={t('lesson_admin_placeholder_price')}
                        value={formData.price}
                        onChange={set('price')}
                        required
                    />
                    <input
                        className="input"
                        type="number"
                        placeholder={t('lesson_admin_placeholder_spots')}
                        value={formData.spots}
                        onChange={set('spots')}
                    />
                    <input
                        className="input"
                        placeholder={t('lesson_admin_placeholder_salle')}
                        value={formData.salle}
                        onChange={set('salle')}
                    />
                    <select className="input" value={formData.teacher_id} onChange={set('teacher_id')}>
                        <option value="">{t('lesson_admin_teacher_none')}</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.prenom} {u.nom}
                            </option>
                        ))}
                    </select>
                    <label className="merch-admin__checkbox-label">
                        <input
                            type="checkbox"
                            checked={formData.available}
                            onChange={(e) => setFormData({...formData, available: e.target.checked})}
                        />
                        {t('lesson_admin_label_available')}
                    </label>
                    <div className="merch-admin__modal__actions">
                        <button className="btn" type="submit">
                            {isCreating ? t('lesson_admin_btn_create') : t('item_edit_btn_save')}
                        </button>
                    </div>
                </form>

                {!isCreating && (
                    <div className="lesson-edit__sessions">
                        <h3 className="lesson-edit__sessions-title">{t('lesson_admin_sessions_title')}</h3>

                        {sessionError && <p className="merch-admin__feedback">{sessionError}</p>}

                        {sessions.length === 0 ? (
                            <p className="lesson-edit__sessions-empty">{t('lesson_admin_sessions_empty')}</p>
                        ) : (
                            <ul className="lesson-edit__sessions-list">
                                {sessions.map(s => (
                                    <li key={s.id} className="lesson-edit__session-item">
                                        <span>{s.date} · {s.heure_debut.slice(0, 5)}–{s.heure_fin.slice(0, 5)}</span>
                                        <button
                                            type="button"
                                            className="btn btn__ghost lesson-edit__session-delete"
                                            onClick={() => handleDeleteSession(s.id)}
                                        >
                                            {t('lesson_admin_sessions_btn_delete')}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <form className="lesson-edit__session-form" onSubmit={handleAddSession}>
                            <input
                                className="input"
                                type="date"
                                value={sessionForm.date}
                                onChange={e => setSessionForm({...sessionForm, date: e.target.value})}
                                required
                            />
                            <input
                                className="input"
                                type="time"
                                value={sessionForm.heure_debut}
                                onChange={e => setSessionForm({...sessionForm, heure_debut: e.target.value})}
                                required
                            />
                            <input
                                className="input"
                                type="time"
                                value={sessionForm.heure_fin}
                                onChange={e => setSessionForm({...sessionForm, heure_fin: e.target.value})}
                                required
                            />
                            <button className="btn" type="submit">
                                {t('lesson_admin_sessions_btn_add')}
                            </button>
                        </form>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}

export default LessonEdit;
