/** Modale de création / modification d'un article **/

import {useEffect, useState} from 'react';
import {createItem, updateItem} from '../service/itemsServiceFront';
import {getAllPromotions} from '../service/promotionServiceFront';

const GENRES = ['femme', 'homme', 'neutre'];
const CATEGORIES = ['pantalon', 'robe', 'tshirt', 'chemise', 'blouse', 'polo', 'pull', 'sweat', 'chaussures', 'ceinture', 'manteau'];

const emptyItem = {
    name: '',
    price: '',
    size: '',
    comfort: '',
    onSale: false,
    description: '',
    gender: 'neutre',
    category: 'tshirt',
    stock: 0,
    promotion_id: ''
};

function ItemEdit({isOpen, item, onClose, onSaved}) {
    const [formData, setFormData] = useState(emptyItem);
    const [error, setError] = useState('');
    const [promotions, setPromotions] = useState([]);

    const isCreating = !item;

    useEffect(() => {
        getAllPromotions()
            .then(setPromotions)
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        setFormData(item ? {
            name: item.name || '',
            price: item.price ?? '',
            size: item.size || '',
            comfort: item.comfort ?? '',
            onSale: Boolean(item.onSale),
            description: item.description || '',
            gender: item.gender || 'neutre',
            category: item.category || 'tshirt',
            stock: item.stock ?? 0,
            promotion_id: item.promotion_id ?? ''
        } : emptyItem);
        setError('');
    }, [item, isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
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
            comfort: formData.comfort === '' ? null : Number(formData.comfort),
            stock: Number(formData.stock),
            promotion_id: formData.promotion_id === '' ? null : Number(formData.promotion_id)
        };
        try {
            if (isCreating) {
                await createItem(payload);
            } else {
                await updateItem(item.id, payload);
            }
            onSaved();
            onClose();
        } catch (err) {
            setError(err.message);
        }
    }

    function set(field) {
        return (e) => setFormData({...formData, [field]: e.target.value});
    }

    return (
        <div className="merch-admin__modal__overlay" onClick={onClose}>
            <div className="merch-admin__modal__content" onClick={(e) => e.stopPropagation()}>
                <div className="merch-admin__modal__header">
                    <h2 className="merch-admin__subtitle">{isCreating ? 'Ajouter un article' : 'Modifier un article'}</h2>
                    <button type="button" className="btn btn__ghost" onClick={onClose}>Fermer</button>
                </div>

                {error && <p className="merch-admin__feedback">{error}</p>}

                <form className="merch-admin__form" onSubmit={handleSubmit}>
                    <input className="input" placeholder="Nom" value={formData.name} onChange={set('name')} required/>
                    <input className="input" type="number" step="0.01" placeholder="Prix" value={formData.price}
                           onChange={set('price')} required/>
                    <input className="input" type="number" placeholder="Stock" value={formData.stock}
                           onChange={set('stock')} required/>
                    <select className="input" value={formData.gender} onChange={set('gender')}>
                        {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select className="input" value={formData.category} onChange={set('category')}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input className="input" placeholder="Taille" value={formData.size} onChange={set('size')}/>
                    <input className="input" type="number" placeholder="Confort" value={formData.comfort ?? ''}
                           onChange={set('comfort')}/>
                    <textarea className="input merch-admin__textarea" placeholder="Description"
                              value={formData.description} onChange={set('description')}/>
                    <select className="input" value={formData.promotion_id} onChange={set('promotion_id')}>
                        <option value="">Aucune promotion</option>
                        {promotions.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name} — -{p.discount_percent}% ({p.code})
                            </option>
                        ))}
                    </select>
                    <label className="merch-admin__checkbox">
                        <input
                            type="checkbox"
                            checked={Boolean(formData.onSale)}
                            onChange={(e) => setFormData({...formData, onSale: e.target.checked})}
                        />
                        En promo
                    </label>
                    <div className="merch-admin__modal__actions">
                        <button className="btn" type="submit">{isCreating ? 'Ajouter' : 'Enregistrer'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ItemEdit;
