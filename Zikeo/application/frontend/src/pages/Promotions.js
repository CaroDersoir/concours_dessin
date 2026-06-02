/** Page Promotions : articles en promo pour les users, gestion CRUD pour les admins **/

import {useEffect, useState, useContext} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Item from '../components/Item';
import {
    getAllPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion
} from '../service/promotionServiceFront';
import {getAllItems} from '../service/itemsServiceFront';
import {LanguageContext} from '../context/languageContext';
import '../styles/Promotions.css';

const emptyPromo = {
    name: '',
    code: '',
    description: '',
    discount_percent: '',
    start_date: '',
    end_date: '',
    conditions: '',
    type: 'item'
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

function CopyButton({code, t}) {
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
            {copied ? t('promo_copied') : t('promo_copy')}
        </button>
    );
}

function PromoModal({isOpen, promo, onClose, onSaved, t}) {
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
            conditions: promo.conditions || '',
            type: promo.type || 'item'
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
            discount_percent: Number(formData.discount_percent),
            code: formData.code || null
        };

        if (payload.type === 'code' && !formData.code) {
            setError(t('promo_modal_error_code_required'));
            return;
        }
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
                        {isCreating ? t('promo_modal_title_add') : t('promo_modal_title_edit')}
                    </h2>
                    <button type="button" className="btn btn--ghost" onClick={onClose}>{t('item_btn_close')}</button>
                </div>

                {error && <p className="promo-modal__feedback">{error}</p>}

                <form className="promo-modal__form" onSubmit={handleSubmit}>
                    <input className="input" placeholder={t('promo_modal_placeholder_name')} value={formData.name}
                           onChange={set('name')} required/>
                    <div className="promo-modal__row">
                        <input className="input" placeholder={t('promo_modal_placeholder_code')} value={formData.code}
                               onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                               required={formData.type === 'code'} style={{textTransform: 'uppercase'}}/>
                        <input className="input" type="number" min="1" max="100" step="0.01"
                               placeholder={t('promo_modal_placeholder_discount')} value={formData.discount_percent}
                               onChange={set('discount_percent')} required/>
                    </div>
                    <select className="input" value={formData.type} onChange={set('type')}>
                        <option value="item">{t('promo_modal_type_item')}</option>
                        <option value="code">{t('promo_modal_type_code')}</option>
                    </select>
                    <div className="promo-modal__row">
                        <label className="input" style={{display: 'grid', gap: '2px', fontSize: '0.82rem'}}>
                            {t('promo_modal_label_start')}
                            <input type="date" value={formData.start_date} onChange={set('start_date')}
                                   required style={{background: 'transparent', border: 'none', color: 'var(--text)'}}/>
                        </label>
                        <label className="input" style={{display: 'grid', gap: '2px', fontSize: '0.82rem'}}>
                            {t('promo_modal_label_end')}
                            <input type="date" value={formData.end_date} onChange={set('end_date')}
                                   required style={{background: 'transparent', border: 'none', color: 'var(--text)'}}/>
                        </label>
                    </div>
                    <textarea className="input" placeholder={t('item_edit_placeholder_desc')} value={formData.description}
                              onChange={set('description')} rows={2}/>
                    <textarea className="input" placeholder={t('promo_modal_placeholder_conditions')} value={formData.conditions}
                              onChange={set('conditions')} rows={2}/>
                    <div className="promo-modal__actions">
                        <button className="btn" type="submit">
                            {isCreating ? t('promo_modal_btn_create') : t('item_edit_btn_save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function UserPromotionsView({t}) {
    const [items, setItems] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cart, updateCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('zikeo_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('zikeo_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated'));
    }, [cart]);

    useEffect(() => {
        setLoading(true);
        getAllItems()
            // show only items that have a promotion associated and that are item-level promotions
            .then(data => setItems(data.filter(item => item.promotion && item.promotion.type === 'item')))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        // fetch promotions to display in the left column (read-only for users)
        getAllPromotions()
            .then(data => setPromotions(data))
            .catch(() => setPromotions([]));
    }, []);

    function addToCart(item) {
        const existing = cart.find(i => i.name === item.name);
        if (existing) {
            updateCart(cart.map(i => i.name === item.name ? {...i, amount: i.amount + 1} : i));
        } else {
            updateCart([...cart, {...item, amount: 1}]);
        }
    }

    return (
        <div className="page">
            <Header/>
            <main className="page__content promos">
                <h1 className="page__title">{t('promo_title')}</h1>
                {loading && <p>{t('merch_admin_loading')}</p>}

                <div style={{display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start'}}>
                    <aside>
                        <div style={{background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 12}}>
                            <h2 style={{marginTop: 0}}>{t('promo_list_title') || 'Promotions'}</h2>
                            {promotions.length === 0 && <p style={{opacity: 0.7}}>{t('promo_empty')}</p>}
                            <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8}}>
                                {promotions.map(p => (
                                    <li key={p.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8}}>
                                        <div>
                                            <div style={{fontWeight: 700}}>{p.name} <span style={{fontWeight:400, fontSize:'0.85rem', opacity:0.8}}> ({p.type})</span></div>
                                            <div style={{fontSize: '0.9rem', opacity: 0.8}}>-{p.discount_percent}% {p.code ? `• ${p.code}` : ''}</div>
                                        </div>
                                        {p.code ? <CopyButton code={p.code} t={t} /> : null}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                    <section>
                        <ul className="promos__grid">
                            {items.map(item => (
                                <Item key={item.id ?? item.name} item={item} addToCart={addToCart}/>
                            ))}
                            {!loading && items.length === 0 && (
                                <p className="promos__empty">{t('promo_items_empty')}</p>
                            )}
                        </ul>
                    </section>
                </div>
            </main>
            <Footer/>
        </div>
    );
}

function AdminPromotionsView({t}) {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);

    async function loadPromotions() {
        setLoading(true);
        try {
            const data = await getAllPromotions();
            setPromotions(data);
        } catch {
            setFeedback(t('promo_error_load'));
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
            setFeedback(t('promo_deleted'));
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
                    <h1 className="page__title">{t('promo_title')}</h1>
                    <button className="btn" onClick={openCreate}>{t('promo_btn_add')}</button>
                </div>

                {feedback && <p className="promo-modal__feedback">{feedback}</p>}
                {loading && <p>{t('merch_admin_loading')}</p>}

                <ul className="promos__grid">
                    {promotions.map((promo) => (
                        <li key={promo.id} className="promo-card">
                            <div className="promo-card__header">
                                <h2 className="promo-card__name">{promo.name}</h2>
                                <span className="promo-card__badge">-{promo.discount_percent}%</span>
                            </div>

                            <div className="promo-card__code-row">
                                <span className="promo-card__code">{promo.code}</span>
                                <CopyButton code={promo.code} t={t}/>
                            </div>

                            {promo.description && (
                                <p className="promo-card__description">{promo.description}</p>
                            )}

                            <div className="promo-card__meta">
                                <span>
                                    {t('promo_dates', {start: formatDate(promo.start_date), end: formatDate(promo.end_date)})}
                                    {' '}{isActive(promo)
                                        ? t('promo_active')
                                        : new Date(promo.end_date) < new Date() ? t('promo_expired') : t('promo_upcoming')}
                                </span>
                            </div>

                            {promo.conditions && (
                                <p className="promo-card__conditions">
                                    {t('promo_conditions_label', {conditions: promo.conditions})}
                                </p>
                            )}

                            {promo.items && promo.items.length > 0 && (
                                <div className="promo-card__items">
                                    {promo.items.map((item) => (
                                        <span key={item.id} className="promo-card__item-tag">{item.name}</span>
                                    ))}
                                </div>
                            )}

                            <div className="promo-card__actions">
                                <button className="btn btn--ghost" onClick={() => openEdit(promo)}>
                                    {t('promo_btn_edit')}
                                </button>
                                <button className="btn btn--ghost" onClick={() => handleDelete(promo.id)}>
                                    {t('promo_btn_delete')}
                                </button>
                            </div>
                        </li>
                    ))}
                    {!loading && promotions.length === 0 && (
                        <p className="promos__empty">{t('promo_empty')}</p>
                    )}
                </ul>
            </main>
            <Footer/>

            <PromoModal
                isOpen={modalOpen}
                promo={editingPromo}
                onClose={() => setModalOpen(false)}
                onSaved={loadPromotions}
                t={t}
            />
        </div>
    );
}

function Promotions() {
    const {t} = useContext(LanguageContext);

    // Page promotions : always show user view (read-only), regardless of admin status
    // Admins manage promotions from a different admin panel if needed
    return <UserPromotionsView t={t}/>;
}

export default Promotions;
