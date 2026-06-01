/** catalogue des leçons organisé en deux bulles : Formation musicale / Pratique d'un instrument **/

import { useEffect, useState } from 'react';
import { getAllLessons } from '../service/lessonServiceFront';
import '../styles/Formations.css';

const LEVEL_LABELS = {
    'débutant': 'Débutant',
    'intermédiaire': 'Intermédiaire',
    'avancé': 'Avancé'
};

function LessonCard({ lesson, addToCart }) {
    return (
        <div className={`lesson-card ${!lesson.available ? 'lesson-card--unavailable' : ''}`}>
            <div className="lesson-card__header">
                <span className="lesson-card__name">{lesson.name}</span>
                <span className="lesson-card__level">{LEVEL_LABELS[lesson.level] ?? lesson.level}</span>
            </div>
            {lesson.description && (
                <p className="lesson-card__description">{lesson.description}</p>
            )}
            <div className="lesson-card__footer">
                <span className="lesson-card__price">{lesson.price} €</span>
                <button
                    className="btn btn__ghost lesson-card__btn"
                    onClick={() => addToCart(lesson)}
                    disabled={!lesson.available}
                >
                    {lesson.available ? 'Ajouter' : 'Complet'}
                </button>
            </div>
        </div>
    );
}

function LessonBubble({ title, icon, lessons, addToCart }) {
    return (
        <div className="lesson-bubble">
            <div className="lesson-bubble__header">
                <span className="material-symbols-outlined lesson-bubble__icon">{icon}</span>
                <h2 className="lesson-bubble__title">{title}</h2>
            </div>
            <div className="lesson-bubble__list">
                {lessons.length === 0 ? (
                    <p className="lesson-bubble__empty">Aucune prestation disponible pour le moment.</p>
                ) : (
                    lessons.map(lesson => (
                        <LessonCard key={lesson.id} lesson={lesson} addToCart={addToCart} />
                    ))
                )}
            </div>
        </div>
    );
}

function LessonCatalog({ cart, updateCart }) {
    const [lessons, setLessons] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        getAllLessons()
            .then(setLessons)
            .catch(() => setError('Impossible de charger les prestations.'));
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

    const theory = lessons.filter(l => l.type === 'theory');
    const instrument = lessons.filter(l => l.type === 'instrument');

    return (
        <div className="lesson-catalog">
            {error && <p className="lesson-catalog__error">{error}</p>}
            <div className="lesson-catalog__grid">
                <LessonBubble
                    title="Formation musicale"
                    icon="music_note_2"
                    lessons={theory}
                    addToCart={addToCart}
                />
                <LessonBubble
                    title="Pratique d'un instrument"
                    icon="piano"
                    lessons={instrument}
                    addToCart={addToCart}
                />
            </div>
        </div>
    );
}

export default LessonCatalog;
