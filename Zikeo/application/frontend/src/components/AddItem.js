import {useEffect, useState} from 'react';

const emptyItem = {
    name: '',
    price: '',
    size: '',
    comfort: '',
    onSale: false,
    description: '',
    gender: 'neutre',
    category: 't-shirt',
    stock: 0
};

function AddItem({
    isOpen,
    onClose,
    onSubmit,
    genres,
    categories,
    initialValues,
    title = 'Ajouter un article',
    submitLabel = 'Ajouter'
}) {
    const [formData, setFormData] = useState(emptyItem);

    useEffect(() => {
        if (!isOpen) return;
        setFormData({...emptyItem, ...(initialValues || {})});
    }, [initialValues, isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    async function handleSubmit(event) {
        event.preventDefault();
        const success = await onSubmit(formData);
        if (success) {
            onClose();
        }
    }

    return (
        <div className="merch-admin__modal__overlay" onClick={onClose}>
            <div className="merch-admin__modal__content" onClick={(event) => event.stopPropagation()}>
                <div className="merch-admin__modal__header">
                    <h2 className="merch-admin__subtitle">{title}</h2>
                    <button type="button" className="btn btn__ghost" onClick={onClose}>Fermer</button>
                </div>

                <form className="merch-admin__form" onSubmit={handleSubmit}>
                    <input
                        className="input"
                        placeholder="Nom"
                        value={formData.name}
                        onChange={(event) => setFormData({...formData, name: event.target.value})}
                        required
                    />
                    <input
                        className="input"
                        type="number"
                        step="0.01"
                        placeholder="Prix"
                        value={formData.price}
                        onChange={(event) => setFormData({...formData, price: event.target.value})}
                        required
                    />
                    <input
                        className="input"
                        type="number"
                        placeholder="Stock"
                        value={formData.stock}
                        onChange={(event) => setFormData({...formData, stock: event.target.value})}
                        required
                    />
                    <select
                        className="input"
                        value={formData.gender}
                        onChange={(event) => setFormData({...formData, gender: event.target.value})}
                    >
                        {genres.map((genre) => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                    <select
                        className="input"
                        value={formData.category}
                        onChange={(event) => setFormData({...formData, category: event.target.value})}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <input
                        className="input"
                        placeholder="Taille"
                        value={formData.size}
                        onChange={(event) => setFormData({...formData, size: event.target.value})}
                    />
                    <input
                        className="input"
                        type="number"
                        placeholder="Confort"
                        value={formData.comfort ?? ''}
                        onChange={(event) => setFormData({...formData, comfort: event.target.value})}
                    />
                    <textarea
                        className="input merch-admin__textarea"
                        placeholder="Description"
                        value={formData.description}
                        onChange={(event) => setFormData({...formData, description: event.target.value})}
                    />
                    <label className="merch-admin__checkbox">
                        <input
                            type="checkbox"
                            checked={Boolean(formData.onSale)}
                            onChange={(event) => setFormData({...formData, onSale: event.target.checked})}
                        />
                        En promo
                    </label>

                    <div className="merch-admin__modal__actions">
                        <button className="btn" type="submit">{submitLabel}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddItem;
