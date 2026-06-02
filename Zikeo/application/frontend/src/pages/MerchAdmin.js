/** Page MerchAdmin : gestion des articles et promotions pour les administrateurs **/

import {useContext, useEffect, useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ItemEdit from '../components/ItemEdit';
import ListItem from '../components/ListItem';
import {deleteItem, getAllItems} from '../service/itemsServiceFront';
import {deletePromotion, getAllPromotions} from '../service/promotionServiceFront';
import {LanguageContext} from '../context/languageContext';
import '../styles/MerchAdmin.css';
import PromotionEdit from "../components/PromotionEdit";

const EMPTY = '';

const SORT_VALUES = [
    {value: 'default', key: 'catalog_sort_default'},
    {value: 'promo', key: 'merch_admin_sort_promo'},
    {value: 'price_asc', key: 'catalog_sort_price_asc'},
    {value: 'price_desc', key: 'catalog_sort_price_desc'},
    {value: 'name_asc', key: 'catalog_sort_name_asc'},
    {value: 'name_desc', key: 'catalog_sort_name_desc'},
    {value: 'comfort_desc', key: 'catalog_sort_comfort_desc'},
];

function unique(items, key) {
    return [...new Set(items.map(i => i[key]).filter(Boolean))].sort();
}

function applySorting(items, sort) {
    const list = [...items];
    switch (sort) {
        case 'promo':
            return list.sort((a, b) => (b.promotion ? 1 : 0) - (a.promotion ? 1 : 0));
        case 'price_asc':
            return list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        case 'price_desc':
            return list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        case 'name_asc':
            return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        case 'name_desc':
            return list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        case 'comfort_desc':
            return list.sort((a, b) => (b.comfort ?? 0) - (a.comfort ?? 0));
        default:
            return list;
    }
}

// Composant principal : affiche les onglets Items et Promotions avec gestion complète
function MerchAdmin() {
    const {t} = useContext(LanguageContext);
    const [activeTab, setActiveTab] = useState('items'); // 'items' or 'promotions'
    const [items, setItems] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [search, setSearch] = useState(EMPTY);
    const [filterCategory, setFilterCategory] = useState(EMPTY);
    const [filterGender, setFilterGender] = useState(EMPTY);
    const [filterSize, setFilterSize] = useState(EMPTY);
    const [sort, setSort] = useState('default');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [itemsFeedback, setItemsFeedback] = useState('');
    const [itemsLoading, setItemsLoading] = useState(false);
    const [promoFeedback, setPromoFeedback] = useState('');
    const [promoLoading, setPromoLoading] = useState(false);
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);

    async function loadItems() {
        setItemsLoading(true);
        try {
            const data = await getAllItems();
            setItems(data || []);
        } catch (error) {
            setItemsFeedback(t('merch_admin_error_load'));
        } finally {
            setItemsLoading(false);
        }
    }

    async function loadPromotions() {
        setPromoLoading(true);
        try {
            const data = await getAllPromotions();
            setPromotions(data || []);
        } catch (error) {
            setPromoFeedback(t('promo_error_load'));
        } finally {
            setPromoLoading(false);
        }
    }

    useEffect(() => {
        loadItems();
        loadPromotions();
    }, []);


    async function removeItem(id) {
        setItemsFeedback('');
        try {
            await deleteItem(id);
            setItemsFeedback(t('merch_admin_deleted', {id}));
            await loadItems();
        } catch (error) {
            setItemsFeedback(error.message);
        }
    }

    async function handlePromoDelete(id) {
        setPromoFeedback('');
        try {
            await deletePromotion(id);
            setPromoFeedback(t('promo_deleted'));
            await loadPromotions();
        } catch (error) {
            setPromoFeedback(error.response?.data?.error || error.message);
        }
    }

    async function handlePromoSave() {
        setPromoFeedback('');
        try {
            await loadPromotions();
            setIsPromoModalOpen(false);
            setEditingPromo(null);
        } catch (error) {
            setPromoFeedback(error.message);
        }
    }

    const hasFilter = search || filterCategory || filterGender || filterSize || sort !== 'default';

    const filteredItems = applySorting(
        items.filter(item => {
            if (search && !(item.name || '').toLowerCase().includes(search.toLowerCase())) return false;
            if (filterCategory && item.category !== filterCategory) return false;
            if (filterGender && item.gender !== filterGender) return false;
            if (filterSize && item.size !== filterSize) return false;
            return true;
        }),
        sort
    );

    function resetFilters() {
        setSearch(EMPTY);
        setFilterCategory(EMPTY);
        setFilterGender(EMPTY);
        setFilterSize(EMPTY);
        setSort('default');
    }

    return (
        <div className="page">
            <Header/>
            <main className="page__content merch-admin">
                <section className="merch-admin__topbar">
                    <h1 className="page__title">{t('merch_admin_title')}</h1>
                    <button className="btn" onClick={() => {
                        if (activeTab === 'items') setIsAddOpen(true);
                        else {
                            setEditingPromo(null);
                            setIsPromoModalOpen(true);
                        }
                    }}>
                        {activeTab === 'items' ? t('merch_admin_btn_add') : t('promo_btn_add')}
                    </button>
                </section>

                <div className="merch-admin__tabs">
                    <button
                        className={`btn ${activeTab === 'items' ? '' : 'btn--ghost'}`}
                        onClick={() => {
                            setActiveTab('items');
                            resetFilters();
                        }}
                    >
                        {t('item_merch_title')}
                    </button>
                    <button
                        className={`btn ${activeTab === 'promotions' ? '' : 'btn--ghost'}`}
                        onClick={() => {
                            setActiveTab('promotions');
                            resetFilters();
                        }}
                    >
                        {t('promo_title')}
                    </button>
                </div>

                <section className="page__section merch-admin__panel">
                    {activeTab === 'items' ? (
                        <>
                            <div className="merch-admin__filters">
                                <input
                                    className="input merch-admin__search"
                                    placeholder={t('catalog_search_placeholder')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <select
                                    className="input merch-admin__filter-select"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <option value={EMPTY}>{t('catalog_all_categories')}</option>
                                    {unique(items, 'category').map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                                <select
                                    className="input merch-admin__filter-select"
                                    value={filterGender}
                                    onChange={(e) => setFilterGender(e.target.value)}
                                >
                                    <option value={EMPTY}>{t('catalog_all_genders')}</option>
                                    {unique(items, 'gender').map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                                <select
                                    className="input merch-admin__filter-select"
                                    value={filterSize}
                                    onChange={(e) => setFilterSize(e.target.value)}
                                >
                                    <option value={EMPTY}>{t('catalog_all_sizes')}</option>
                                    {unique(items, 'size').map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                                <select
                                    className="input merch-admin__filter-select"
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    {SORT_VALUES.map(o => (
                                        <option key={o.value} value={o.value}>{t(o.key)}</option>
                                    ))}
                                </select>
                                {hasFilter && (
                                    <button className="btn btn--ghost" onClick={resetFilters}>
                                        {t('catalog_reset')}
                                    </button>
                                )}
                            </div>
                            {itemsLoading ? <p>{t('merch_admin_loading')}</p> : null}
                            {itemsFeedback ? <p className="merch-admin__feedback">{itemsFeedback}</p> : null}

                            <div className="merch-admin__list">
                                {filteredItems.map((item) => (
                                    <ListItem
                                        key={item.id}
                                        item={item}
                                        onSaved={loadItems}
                                        onDelete={removeItem}
                                    />
                                ))}
                                {!itemsLoading && filteredItems.length === 0 ? (
                                    <p className="merch-admin__empty">{t('merch_admin_empty')}</p>
                                ) : null}
                            </div>
                        </>
                    ) : (
                        <>
                            {promoLoading ? <p>{t('merch_admin_loading')}</p> : null}
                            {promoFeedback ? <p className="merch-admin__feedback">{promoFeedback}</p> : null}

                            <div className="merch-admin__list">
                                {promotions.map((promo) => (
                                    <div key={promo.id} className="merch-admin__item-promo">
                                        <div className="merch-admin__item-promo__info">
                                            <div className="merch-admin__item-promo__name">{promo.name}</div>
                                            <div className="merch-admin__item-promo__details">
                                                -{promo.discount_percent}%
                                                | {promo.code || t('promo_no_code')} | {promo.type}
                                            </div>
                                        </div>
                                        <div className="merch-admin__item-promo__actions">
                                            <button className="btn btn--ghost" onClick={() => {
                                                setEditingPromo(promo);
                                                setIsPromoModalOpen(true);
                                            }}>
                                                {t('promo_btn_edit')}
                                            </button>
                                            <button className="btn btn--ghost"
                                                    onClick={() => handlePromoDelete(promo.id)}>
                                                {t('promo_btn_delete')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {!promoLoading && promotions.length === 0 ? (
                                    <p className="merch-admin__empty">{t('promo_empty')}</p>
                                ) : null}
                            </div>
                        </>
                    )}
                </section>

                <ItemEdit
                    isOpen={isAddOpen}
                    onClose={() => setIsAddOpen(false)}
                    onSaved={loadItems}
                />

                {isPromoModalOpen && (
                    <PromotionEdit
                        isOpen={isPromoModalOpen}
                        promo={editingPromo}
                        onClose={() => {
                            setIsPromoModalOpen(false);
                            setEditingPromo(null);
                        }}
                        onSaved={handlePromoSave}
                        t={t}
                    />
                )}
            </main>
            <Footer/>
        </div>
    );
}


export default MerchAdmin;
