import '../styles/ItemMerch.css';
import {useContext, useEffect, useState} from 'react';
import Item from "./Item";
import {getAllItems} from '../service/itemsServiceFront';
import {LanguageContext} from '../context/languageContext';

const EMPTY = '';

const SORT_VALUES = [
    {value: 'default', key: 'catalog_sort_default'},
    {value: 'price_asc', key: 'catalog_sort_price_asc'},
    {value: 'price_desc', key: 'catalog_sort_price_desc'},
    {value: 'name_asc', key: 'catalog_sort_name_asc'},
    {value: 'name_desc', key: 'catalog_sort_name_desc'},
    {value: 'comfort_desc', key: 'catalog_sort_comfort_desc'},
];

function unique(items, key) {
    return [...new Set(items.map(i => i[key]).filter(Boolean))].sort();
}

function uniqueSizes(items) {
    return [...new Set(items.flatMap(i => (i.sizes ?? []).map(s => s.size)).filter(Boolean))].sort();
}

function applySorting(items, sort) {
    const list = [...items];
    switch (sort) {
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

function ItemMerch({cart, updateCart}) {
    const {t} = useContext(LanguageContext);
    const [itemsList, setItemsList] = useState([]);
    const [itemsError, setItemsError] = useState(false);
    const [search, setSearch] = useState(EMPTY);
    const [filterCategory, setFilterCategory] = useState(EMPTY);
    const [filterGender, setFilterGender] = useState(EMPTY);
    const [filterSize, setFilterSize] = useState(EMPTY);
    const [sort, setSort] = useState('default');

    useEffect(() => {
        getAllItems()
            .then(data => setItemsList(data || []))
            .catch(error => {
                console.error('Erreur lors de la récupération des vêtements :', error);
                setItemsError(true);
            });
    }, []);

    const addToCart = (item) => {
        const existing = cart.find(i => i.name === item.name);
        if (existing) {
            updateCart(cart.map(i => i.name === item.name ? {...i, amount: i.amount + 1} : i));
        } else {
            updateCart([...cart, {...item, amount: 1}]);
        }
    };

    const hasFilter = search || filterCategory || filterGender || filterSize || sort !== 'default';

    const filteredItems = applySorting(
        itemsList.filter(item => {
            if (search && !(item.name || '').toLowerCase().includes(search.toLowerCase())) return false;
            if (filterCategory && item.category !== filterCategory) return false;
            if (filterGender && item.gender !== filterGender) return false;
            if (filterSize && !(item.sizes ?? []).some(s => s.size === filterSize)) return false;
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

    if (itemsError) {
        return (
            <div className="catalog">
                <p className="catalog__empty">{t('catalog_error_load')}</p>
            </div>
        );
    }

    return (
        <div className="catalog">
            <div className="catalog__header">
                <div className="catalog__meta">
                    {hasFilter
                        ? t('catalog_count_filtered', {filtered: filteredItems.length, total: itemsList.length})
                        : t('item_merch_count', {count: itemsList.length})
                    }
                </div>
            </div>

            <div className="catalog__filters">
                <input
                    className="input catalog__filters__search"
                    placeholder={t('catalog_search_placeholder')}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className="input catalog__filters__select"
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                >
                    <option value={EMPTY}>{t('catalog_all_categories')}</option>
                    {unique(itemsList, 'category').map(v => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
                <select
                    className="input catalog__filters__select"
                    value={filterGender}
                    onChange={e => setFilterGender(e.target.value)}
                >
                    <option value={EMPTY}>{t('catalog_all_genders')}</option>
                    {unique(itemsList, 'gender').map(v => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
                <select
                    className="input catalog__filters__select"
                    value={filterSize}
                    onChange={e => setFilterSize(e.target.value)}
                >
                    <option value={EMPTY}>{t('catalog_all_sizes')}</option>
                    {uniqueSizes(itemsList).map(v => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
                <select
                    className="input catalog__filters__select"
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                >
                    {SORT_VALUES.map(o => (
                        <option key={o.value} value={o.value}>{t(o.key)}</option>
                    ))}
                </select>
                {hasFilter && (
                    <button className="btn btn--ghost catalog__filters__reset" onClick={resetFilters}>
                        {t('catalog_reset')}
                    </button>
                )}
            </div>

            <ul className="catalog__grid">
                {filteredItems.map((item) => (
                    <Item id={item.id} key={item.name} item={item} addToCart={addToCart}/>
                ))}
                {filteredItems.length === 0 && (
                    <li className="catalog__empty">{t('catalog_empty')}</li>
                )}
            </ul>
        </div>
    );
}


export default ItemMerch
