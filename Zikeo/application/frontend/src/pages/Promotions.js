/** Page affichant toutes les promotions actives, avec gestion admin **/

import {useEffect, useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    getAllPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion
} from '../service/promotionServiceFront';
import '../styles/Promotions.css';

const emptyPromo = {
    name: '',
    code: '',
    description: '',
    discount_percent: '',
    start_date: '',
    end_date: '',
    conditions: ''
};

function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR');
}

function isActive(promo) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today >= new Date(promo.start_date) && today <= new Date(promo.end_date);
}

function CopyButton({code}) {
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <button
            type="button"
            className={`promo-card__copy ${copied ? 'promo-card__copy--copied' : ''}`}
            onClick={handleCopy}
        >
            {copied ? 'Copié !' : 'Copier'}
        </button>
    );
}

function PromoModal({isOpen, promo, onClose, onSaved}) {
    const [formData, setFormData] = useState(emptyPromo);
    const [error, setError] = useState('');

    const isCreating = !promo;

    useEffect(() => {
        if (!isOpen) return;
        setFormData(promo ? {
            name: promo.name || '',
            code: promo.code || '',
            description: promo.description || '',
            discount_percent: promo.discount_percent ?? '',
            start_date: promo.start_date || '',
            end_date: promo.end_date || '',
            conditions: promo.conditions || ''
        } : emptyPromo);
        setError('');
    }, [promo, isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    function set(field) {
        return (e) => setFormData({...formData, [field]: e.target.value});
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        const payload = {
            ...formData,
            discount_percent: Number(formData.discount_percent)
        };
        try {
            if (isCreating) {
                await createPromotion(payload);
            } else {
                await updatePromotion(promo.id, payload);
            }
            onSaved();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    }

    return (
        <div className="promo-modal__overlay" onClick={onClose}>
            <div className="promo-modal__content" onClick={(e) => e.stopPropagation()}>
                <div className="promo-modal__header">
                    <h2 className="promo-modal__title">
                        {isCreating ? 'Ajouter une promotion' : 'Modifier la promotion'}
                    </h2>
                    <button type="button" className="btn btn--ghost" onClick={onClose}>Fermer</button>
                </div>

                {error && <p className="promo-modal__feedback">{error}</p>}

                <form className="promo-modal__form" onSubmit={handleSubmit}>
                    <input className="input" placeholder="Nom de la promotion" value={formData.name}
                           onChange={set('name')} required/>
                    <div className="promo-modal__row">
                        <input className="input" placeholder="Code (ex: SUMMER20)" value={formData.code}
                               onChange={set('code')} required style={{textTransform: 'uppercase'}}/>
                        <input className="input" type="number" min="1" max="100" step="0.01"
                               placeholder="Réduction (%)" value={formData.discount_percent}
                               onChange={set('discount_percent')} required/>
                    </div>
                    <div className="promo-modal__row">
                        <label className="input" style={{display: 'grid', gap: '2px', fontSize: '0.82rem'}}>
                            Début
                            <input type="date" value={formData.start_date} onChange={set('start_date')}
                                   required style={{background: 'transparent', border: 'none', color: 'var(--text)'}}/>
                        </label>
                        <label className="input" style={{display: 'grid', gap: '2px', fontSize: '0.82rem'}}>
                            Fin
                            <input type="date" value={formData.end_date} onChange={set('end_date')}
                                   required style={{background: 'transparent', border: 'none', color: 'var(--text)'}}/>
                        </label>
                    </div>
                    <textarea className="input" placeholder="Description" value={formData.description}
                              onChange={set('description')} rows={2}/>
                    <textarea className="input" placeholder="Conditions d'utilisation" value={formData.conditions}
                              onChange={set('conditions')} rows={2}/>
                    <div className="promo-modal__actions">
                        <button className="btn" type="submit">
                            {isCreating ? 'Créer' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Promotions() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    async function loadPromotions() {
        setLoading(true);
        try {
            const data = await getAllPromotions();
            setPromotions(data);
        } catch {
            setFeedback('Impossible de charger les promotions.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPromotions();
    }, []);

    function openCreate() {
        setEditingPromo(null);
        setModalOpen(true);
    }

    function openEdit(promo) {
        setEditingPromo(promo);
        setModalOpen(true);
    }

    async function handleDelete(id) {
        setFeedback('');
        try {
            await deletePromotion(id);
            setFeedback('Promotion supprimée.');
            await loadPromotions();
        } catch (err) {
            setFeedback(err.response?.data?.error || err.message);
        }
    }

    return (
        <div className="page">
            <Header/>
            <main className="page__content promos">
                <div className="promos__topbar">
                    <h1 className="page__title">Promotions</h1>
                    {isAdmin && (
                        <button className="btn" onClick={openCreate}>Ajouter une promotion</button>
                    )}
                </div>

                {feedback && <p className="promo-modal__feedback">{feedback}</p>}
                {loading && <p>Chargement...</p>}

                <ul className="promos__grid">
                    {promotions.map((promo) => (
                        <li key={promo.id} className="promo-card">
                            <div className="promo-card__header">
                                <h2 className="promo-card__name">{promo.name}</h2>
                                <span className="promo-card__badge">-{promo.discount_percent}%</span>
                            </div>

                            <div className="promo-card__code-row">
                                <span className="promo-card__code">{promo.code}</span>
                                <CopyButton code={promo.code}/>
                            </div>

                            {promo.description && (
                                <p className="promo-card__description">{promo.description}</p>
                            )}

                            <div className="promo-card__meta">
                                <span>
                                    Valable du {formatDate(promo.start_date)} au {formatDate(promo.end_date)}
                                    {' '}{isActive(promo)
                                        ? '✓ Active'
                                        : new Date(promo.end_date) < new Date() ? '— Expirée' : '— À venir'}
                                </span>
                            </div>

                            {promo.conditions && (
                                <p className="promo-card__conditions">
                                    Conditions : {promo.conditions}
                                </p>
                            )}

                            {promo.items && promo.items.length > 0 && (
                                <div className="promo-card__items">
                                    {promo.items.map((item) => (
                                        <span key={item.id} className="promo-card__item-tag">{item.name}</span>
                                    ))}
                                </div>
                            )}

                            {isAdmin && (
                                <div className="promo-card__actions">
                                    <button className="btn btn--ghost" onClick={() => openEdit(promo)}>
                                        Modifier
                                    </button>
                                    <button className="btn btn--ghost" onClick={() => handleDelete(promo.id)}>
                                        Supprimer
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                    {!loading && promotions.length === 0 && (
                        <p className="promos__empty">Aucune promotion disponible pour le moment.</p>
                    )}
                </ul>
            </main>
            <Footer/>

            <PromoModal
                isOpen={modalOpen}
                promo={editingPromo}
                onClose={() => setModalOpen(false)}
                onSaved={loadPromotions}
            />
        </div>
    );
}

export default Promotions;
