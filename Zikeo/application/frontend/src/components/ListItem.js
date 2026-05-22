import {useState} from 'react';
import AddItem from './AddItem';

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

function ListItem({item, onSave, onDelete, genres, categories}) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    async function handleSave(updatedValues) {
        return onSave(item.id, updatedValues);
    }

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

            <AddItem
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSubmit={handleSave}
                genres={genres}
                categories={categories}
                initialValues={item}
                title="Modifier un article"
                submitLabel="Enregistrer"
            />
        </>
    );
}

export default ListItem;
