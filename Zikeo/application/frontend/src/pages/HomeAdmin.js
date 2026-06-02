/** Page d'administration des cartes de la page d'accueil **/

import {useContext, useEffect, useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {LanguageContext} from '../context/languageContext';
import {getAdminHomeCards, createHomeCard, updateHomeCard, deleteHomeCard} from '../service/homeCardServiceFront';
import {getAllItems} from '../service/itemsServiceFront';
import '../styles/HomeAdmin.css';

const PAGES = [
    {label: '/ — Accueil',    value: '/'},
    {label: '/planning',      value: '/planning'},
    {label: '/merch',         value: '/merch'},
    {label: '/formations',    value: '/formations'},
    {label: '/partitions',    value: '/partitions'},
    {label: '/profile',       value: '/profile'},
    {label: '/login',         value: '/login'},
    {label: '/promotions',    value: '/promotions'},
    {label: '/litiges',       value: '/litiges'},
    {label: '/location',      value: '/location'},
];

const SYMBOLS = [
    '🎵','🎶','🎸','🎹','🎺','🎻',
    '🥁','🎤','🎧','🎼','🎙️','🪗',
    '🗓️','📦','👤','🔔','🌟','📰',
    '🏆','🎯','🛒','📢','🎁','⚡',
    '✨','💎','🚀','🔗','🎊','🔥',
];

const EMPTY_FORM = {type: 'link', icon: '🎵', title: '', subtitle: '', url: '/planning', item_id: ''};

function IconPicker({value, onChange}) {
    return (
        <div className="home-admin__icon-picker">
            {SYMBOLS.map(sym => (
                <button
                    key={sym}
                    type="button"
                    className={`home-admin__icon-btn${value === sym ? ' home-admin__icon-btn--selected' : ''}`}
                    onClick={() => onChange(sym)}
                >
                    {sym}
                </button>
            ))}
        </div>
    );
}

function CardPreview({card}) {
    const typeColors = {link: 'var(--primary)', news: '#ffc800', item: 'var(--secondary)'};
    const color = typeColors[card.type] || 'var(--primary)';
    return (
        <div className="home-admin__card-preview" style={{'--card-color': color}}>
            <span className="home-admin__card-preview__icon">{card.icon || '—'}</span>
            <div className="home-admin__card-preview__body">
                <span className="home-admin__card-preview__title">{card.title || '—'}</span>
                {card.subtitle && (
                    <span className="home-admin__card-preview__sub">{card.subtitle}</span>
                )}
            </div>
        </div>
    );
}

function HomeAdmin() {
    const {t} = useContext(LanguageContext);
    const [cards, setCards]       = useState([]);
    const [items, setItems]       = useState([]);
    const [form, setForm]         = useState(EMPTY_FORM);
    const [editId, setEditId]     = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError]       = useState('');

    const load = () => getAdminHomeCards().then(setCards).catch(() => {});

    useEffect(() => {
        load();
        getAllItems().then(setItems).catch(() => {});
    }, []);

    function openAdd() {
        setForm(EMPTY_FORM);
        setEditId(null);
        setError('');
        setShowForm(true);
    }

    function openEdit(card) {
        setForm({
            type:     card.type,
            icon:     card.icon || '🎵',
            title:    card.title,
            subtitle: card.subtitle || '',
            url:      card.url || '/planning',
            item_id:  card.item_id || ''
        });
        setEditId(card.id);
        setError('');
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditId(null);
        setError('');
    }

    async function handleSave(e) {
        e.preventDefault();
        setError('');
        const payload = {
            type:     form.type,
            icon:     form.icon || null,
            title:    form.title,
            subtitle: form.type !== 'item' ? (form.subtitle || null) : null,
            url:      form.type === 'link' ? (form.url || null) : null,
            item_id:  form.type === 'item' ? (form.item_id || null) : null,
        };
        try {
            if (editId) {
                await updateHomeCard(editId, payload);
            } else {
                const maxPos = cards.length ? Math.max(...cards.map(c => c.position)) + 1 : 0;
                await createHomeCard({...payload, position: maxPos, visible: true});
            }
            await load();
            closeForm();
        } catch {
            setError(t('home_admin_error_save'));
        }
    }

    async function handleDelete(id) {
        if (!window.confirm(t('home_admin_confirm_delete'))) return;
        await deleteHomeCard(id).catch(() => {});
        load();
    }

    async function handleToggle(card) {
        await updateHomeCard(card.id, {visible: !card.visible}).catch(() => {});
        load();
    }

    async function moveCard(card, dir) {
        const sorted = [...cards].sort((a, b) => a.position - b.position);
        const idx    = sorted.findIndex(c => c.id === card.id);
        const other  = sorted[idx + dir];
        if (!other) return;
        await Promise.all([
            updateHomeCard(card.id,  {position: other.position}),
            updateHomeCard(other.id, {position: card.position}),
        ]).catch(() => {});
        load();
    }

    const sortedCards = [...cards].sort((a, b) => a.position - b.position);

    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <div className="home-admin">
                    <div className="home-admin__header">
                        <h1 className="home-admin__title">{t('home_admin_title')}</h1>
                        <button className="btn" onClick={openAdd}>{t('home_admin_btn_add')}</button>
                    </div>

                    <ul className="home-admin__list">
                        {sortedCards.map((card, idx) => (
                            <li key={card.id} className={`home-admin__row${card.visible ? '' : ' home-admin__row--hidden'}`}>
                                <div className="home-admin__row__order">
                                    <button className="home-admin__arrow" onClick={() => moveCard(card, -1)} disabled={idx === 0}>▲</button>
                                    <span className="home-admin__pos">{idx + 1}</span>
                                    <button className="home-admin__arrow" onClick={() => moveCard(card, 1)} disabled={idx === sortedCards.length - 1}>▼</button>
                                </div>

                                <div className={`home-admin__card-icon home-admin__card-icon--${card.type}`}>
                                    {card.type === 'item' && card.item?.covers?.[0]
                                        ? <img src={card.item.covers[0]} alt={card.item.name}/>
                                        : <span>{card.icon || '—'}</span>
                                    }
                                </div>

                                <div className="home-admin__row__info">
                                    <span className="home-admin__row__title">{card.title}</span>
                                    <div className="home-admin__row__meta">
                                        <span className={`home-admin__badge home-admin__badge--${card.type}`}>
                                            {t(`home_admin_type_${card.type}`)}
                                        </span>
                                        {card.type === 'link' && card.url && (
                                            <span className="home-admin__row__url">{card.url}</span>
                                        )}
                                        {card.type === 'item' && card.item && (
                                            <span className="home-admin__row__url">{card.item.name}</span>
                                        )}
                                        {card.subtitle && (
                                            <span className="home-admin__row__sub">{card.subtitle}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="home-admin__row__actions">
                                    <button
                                        className={`home-admin__toggle${card.visible ? ' home-admin__toggle--on' : ''}`}
                                        onClick={() => handleToggle(card)}
                                        title={card.visible ? t('home_admin_hide') : t('home_admin_show')}
                                    >
                                        {card.visible ? '👁' : '🙈'}
                                    </button>
                                    <button className="btn btn--ghost home-admin__edit" onClick={() => openEdit(card)}>
                                        {t('home_admin_btn_edit')}
                                    </button>
                                    <button className="home-admin__delete" onClick={() => handleDelete(card.id)}>
                                        {t('home_admin_btn_delete')}
                                    </button>
                                </div>
                            </li>
                        ))}
                        {sortedCards.length === 0 && (
                            <li className="home-admin__empty">{t('home_admin_empty')}</li>
                        )}
                    </ul>
                </div>

                {showForm && (
                    <div className="home-admin__overlay" onClick={closeForm}>
                        <div className="home-admin__modal" onClick={e => e.stopPropagation()}>
                            <h2 className="home-admin__modal__title">
                                {editId ? t('home_admin_modal_title_edit') : t('home_admin_modal_title_add')}
                            </h2>

                            {error && <p className="home-admin__error">{error}</p>}

                            <CardPreview card={form}/>

                            <form className="home-admin__form" onSubmit={handleSave}>
                                <label className="home-admin__label">{t('home_admin_label_type')}</label>
                                <select
                                    className="input"
                                    value={form.type}
                                    onChange={e => setForm(f => ({...f, type: e.target.value}))}
                                >
                                    <option value="link">{t('home_admin_type_link')}</option>
                                    <option value="news">{t('home_admin_type_news')}</option>
                                    <option value="item">{t('home_admin_type_item')}</option>
                                </select>

                                <label className="home-admin__label">{t('home_admin_label_icon')}</label>
                                <IconPicker
                                    value={form.icon}
                                    onChange={icon => setForm(f => ({...f, icon}))}
                                />

                                <label className="home-admin__label">{t('home_admin_label_title')}</label>
                                <input
                                    className="input"
                                    value={form.title}
                                    onChange={e => setForm(f => ({...f, title: e.target.value}))}
                                    required
                                    placeholder={t('home_admin_placeholder_title')}
                                />

                                {form.type !== 'item' && (
                                    <>
                                        <label className="home-admin__label">{t('home_admin_label_subtitle')}</label>
                                        <input
                                            className="input"
                                            value={form.subtitle}
                                            onChange={e => setForm(f => ({...f, subtitle: e.target.value}))}
                                            placeholder={t('home_admin_placeholder_subtitle')}
                                        />
                                    </>
                                )}

                                {form.type === 'link' && (
                                    <>
                                        <label className="home-admin__label">{t('home_admin_label_url')}</label>
                                        <select
                                            className="input"
                                            value={form.url}
                                            onChange={e => setForm(f => ({...f, url: e.target.value}))}
                                        >
                                            {PAGES.map(p => (
                                                <option key={p.value} value={p.value}>{p.label}</option>
                                            ))}
                                        </select>
                                    </>
                                )}

                                {form.type === 'item' && (
                                    <>
                                        <label className="home-admin__label">{t('home_admin_label_item')}</label>
                                        <select
                                            className="input"
                                            value={form.item_id}
                                            onChange={e => setForm(f => ({...f, item_id: e.target.value}))}
                                            required
                                        >
                                            <option value="">{t('home_admin_item_choose')}</option>
                                            {items.map(it => (
                                                <option key={it.id} value={it.id}>{it.name}</option>
                                            ))}
                                        </select>
                                    </>
                                )}

                                <div className="home-admin__form__actions">
                                    <button type="submit" className="btn">
                                        {editId ? t('home_admin_btn_save') : t('home_admin_btn_create')}
                                    </button>
                                    <button type="button" className="btn btn--ghost" onClick={closeForm}>
                                        {t('home_admin_btn_cancel')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <Footer/>
        </div>
    );
}

export default HomeAdmin;
