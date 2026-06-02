/** Modale de création / modification d'un article **/

import {useEffect, useRef, useState} from 'react';
import {createItem, deleteCover, setSizes, updateItem, uploadCover} from '../service/itemsServiceFront';
import {getAllPromotions} from '../service/promotionServiceFront';

const GENRES = ['femme', 'homme', 'neutre'];
const CATEGORIES = ['pantalon', 'robe', 'tshirt', 'chemise', 'blouse', 'polo', 'pull', 'sweat', 'chaussures', 'ceinture', 'manteau'];
const SIZE_PRESETS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

const emptyItem = {
    name: '',
    price: '',
    description: '',
    gender: 'neutre',
    category: 'tshirt',
    promotion_id: ''
};

function ItemEdit({isOpen, item, onClose, onSaved}) {
    const [formData, setFormData] = useState(emptyItem);
    const [error, setError] = useState('');
    const [promotions, setPromotions] = useState([]);
    const [covers, setCovers] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [sizes, setSizesState] = useState([]);
    const fileInputRef = useRef();

    const isCreating = !item;

    useEffect(() => {
        getAllPromotions()
            .then(all => setPromotions(all.filter(p => p.type !== 'code')))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        setFormData(item ? {
            name: item.name || '',
            price: item.price ?? '',
            description: item.description || '',
            gender: item.gender || 'neutre',
            category: item.category || 'tshirt',
            promotion_id: item.promotion_id ?? ''
        } : emptyItem);
        setCovers(item?.coverObjects || []);
        setNewFiles([]);
        setError('');
        setSizesState(item?.sizes || []);
    }, [item, isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e) => {if (e.key === 'Escape') onClose();};
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        const totalStock = sizes.reduce((acc, s) => acc + (Number(s.stock) || 0), 0);
        const payload = {
            ...formData,
            price: Number(formData.price),
            stock: totalStock,
            promotion_id: formData.promotion_id === '' ? null : Number(formData.promotion_id)
        };

        try {
            let savedId = item?.id;
            if (isCreating) {
                const created = await createItem(payload);
                savedId = created.id;
            } else {
                await updateItem(item.id, payload);
            }

            await Promise.all(newFiles.map(f => uploadCover(savedId, f)));
            await setSizes(savedId, sizes);

            onSaved();
            onClose();
        } catch (err) {
            setError(err.message);
        }
    }

    function set(field) {
        return (e) => setFormData(prev => ({...prev, [field]: e.target.value}));
    }

    function handleFileChange(e) {
        const files = Array.from(e.target.files);
        setNewFiles(prev => [...prev, ...files]);
        e.target.value = '';
    }

    async function handleDeleteCover(cover) {
        try {
            await deleteCover(cover.id);
            setCovers(prev => prev.filter(c => c.id !== cover.id));
        } catch {
            setError('Impossible de supprimer cette image.');
        }
    }

    function removeNewFile(index) {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    }

    function addSizeRow() {
        setSizesState(prev => [...prev, {size: '', stock: 0}]);
    }

    function updateSizeRow(index, field, value) {
        setSizesState(prev => prev.map((s, i) => i === index ? {...s, [field]: value} : s));
    }

    function removeSizeRow(index) {
        setSizesState(prev => prev.filter((_, i) => i !== index));
    }

    return (
        <div className="merch-admin__modal__overlay">
            <div className="merch-admin__modal__content">
                <div className="merch-admin__modal__header">
                    <h2 className="merch-admin__subtitle">{isCreating ? 'Ajouter un article' : 'Modifier un article'}</h2>
                    <button type="button" className="btn btn__ghost" onClick={onClose}>Fermer</button>
                </div>

                <div className="merch-admin__modal__body">
                {error && <p className="merch-admin__feedback">{error}</p>}

                <form className="merch-admin__form" onSubmit={handleSubmit}>
                    <input className="input" placeholder="Nom" value={formData.name} onChange={set('name')} required/>
                    <input className="input" type="number" step="0.01" placeholder="Prix" value={formData.price}
                           onChange={set('price')} required/>
                    <select className="input" value={formData.gender} onChange={set('gender')}>
                        {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select className="input" value={formData.category} onChange={set('category')}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <textarea className="input merch-admin__textarea" placeholder="Description"
                              value={formData.description} onChange={set('description')}/>
                    <select className="input" value={formData.promotion_id} onChange={set('promotion_id')}>
                        <option value="">Aucune promotion</option>
                        {promotions.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name} — -{p.discount_percent}%{p.code ? ` (${p.code})` : ''}
                            </option>
                        ))}
                    </select>

                    {/* Gestion des tailles et stocks */}
                    <datalist id="size-presets">
                        {SIZE_PRESETS.map(p => <option key={p} value={p}/>)}
                    </datalist>
                    <div className="item-edit__sizes">
                        <div className="item-edit__sizes__header">
                            <span className="item-edit__sizes__label">Tailles &amp; stocks</span>
                            <button type="button" className="btn btn__ghost btn--sm" onClick={addSizeRow}>+ Ajouter</button>
                        </div>
                        {sizes.length === 0 && (
                            <p className="item-edit__sizes__empty">Aucune taille — le stock global sera 0.</p>
                        )}
                        {sizes.map((s, i) => (
                            <div key={i} className="item-edit__size__row">
                                <input
                                    className="input"
                                    list="size-presets"
                                    placeholder="Taille (ex: M, 42…)"
                                    value={s.size}
                                    onChange={e => updateSizeRow(i, 'size', e.target.value)}
                                    required
                                />
                                <input
                                    className="input"
                                    type="number"
                                    min="0"
                                    placeholder="Stock"
                                    value={s.stock}
                                    onChange={e => updateSizeRow(i, 'stock', e.target.value)}
                                    required
                                />
                                <button type="button" className="btn btn__ghost btn--sm" onClick={() => removeSizeRow(i)}>✕</button>
                            </div>
                        ))}
                    </div>

                    {/* Gestion des images */}
                    <div className="item-edit__covers">
                        <span className="item-edit__sizes__label">Images</span>
                        <div className="item-edit__covers__grid">
                            {covers.map(cover => (
                                <div key={cover.id} className="item-edit__cover__thumb">
                                    <img src={cover.url} alt="cover"/>
                                    <button type="button" className="item-edit__cover__delete"
                                            onClick={() => handleDeleteCover(cover)}>✕</button>
                                </div>
                            ))}
                            {newFiles.map((f, i) => (
                                <div key={`new-${i}`} className="item-edit__cover__thumb item-edit__cover__thumb--new">
                                    <img src={URL.createObjectURL(f)} alt="preview"/>
                                    <button type="button" className="item-edit__cover__delete"
                                            onClick={() => removeNewFile(i)}>✕</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" className="btn btn__ghost btn--sm"
                                onClick={() => fileInputRef.current.click()}>
                            + Ajouter une image
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple style={{display: 'none'}}
                               onChange={handleFileChange}/>
                    </div>

                    <div className="merch-admin__modal__actions">
                        <button className="btn" type="submit">{isCreating ? 'Ajouter' : 'Enregistrer'}</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}

export default ItemEdit;
