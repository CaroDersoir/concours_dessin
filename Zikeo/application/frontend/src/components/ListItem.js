import {useState} from 'react';
import ItemEdit from './ItemEdit';

function EditIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="currentColor"
                d="M3 17.25V21h3.75L17.8 9.95l-3.75-3.75L3 17.25zm17.71-10.04a1 1 0 0 0 0-1.41L18.2 3.29a1 1 0 0 0-1.41 0L15.13 4.95l3.75 3.75 1.83-1.49z"
            />
        </svg>
    );
}

function DeleteIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="currentColor"
                d="M6 7h12l-1 14H7L6 7zm3-3h6l1 2H8l1-2z"
            />
        </svg>
    );
}

function ListItem({item, onSaved, onDelete}) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    function handleDelete() {
        if (window.confirm(`Supprimer "${item.name}" ?`)) {
            onDelete(item.id);
        }
    }

    return (
        <>
            <article className="merch-admin__list-item card">
                <div className="merch-admin__list-item__media">
                    {item.covers?.[0] ? (
                        <img src={item.covers[0]} alt={item.name}/>
                    ) : (
                        <div className="merch-admin__list-item__placeholder">Pas d'image</div>
                    )}
                </div>

                <div className="merch-admin__list-item__info">
                    <h3 className="merch-admin__list-item__name">{item.name || 'Sans nom'}</h3>
                    <table className="merch-admin__list-item__details">
                        <tbody>
                        <tr>
                            <td>Prix</td>
                            <td>{item.price != null ? `${item.price} €` : '—'}</td>
                            <td>Stock</td>
                            <td>{item.stock ?? '—'}</td>
                        </tr>
                        <tr>
                            <td>Catégorie</td>
                            <td>{item.category || '—'}</td>
                            <td>Genre</td>
                            <td>{item.gender || '—'}</td>
                        </tr>
                        <tr>
                            <td>Taille</td>
                            <td>{item.size || '—'}</td>
                            <td>Confort</td>
                            <td>{item.comfort != null ? item.comfort : '—'}</td>
                        </tr>
                        {item.onSale && (
                            <tr>
                                <td>Promo</td>
                                <td>Oui</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="merch-admin__list-item__actions">
                    <button
                        type="button"
                        className="merch-admin__icon-btn"
                        onClick={() => setIsEditOpen(true)}
                        aria-label={`Modifier ${item.name}`}
                        title="Modifier"
                    >
                        <EditIcon/>
                    </button>
                    <button
                        type="button"
                        className="merch-admin__icon-btn merch-admin__icon-btn__danger"
                        onClick={handleDelete}
                        aria-label={`Supprimer ${item.name}`}
                        title="Supprimer"
                    >
                        <DeleteIcon/>
                    </button>
                </div>
            </article>

            <ItemEdit
                isOpen={isEditOpen}
                item={item}
                onClose={() => setIsEditOpen(false)}
                onSaved={onSaved}
            />
        </>
    );
}

export default ListItem;