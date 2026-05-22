import {useEffect, useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AddItem from '../components/AddItem';
import ListItem from '../components/ListItem';
import '../styles/MerchAdmin.css';

const API_URL = `${process.env.REACT_APP_API_URL}/api/items`;

const GENRES = ['femme', 'homme', 'neutre'];
const CATEGORIES = [
    'pantalon',
    'robe',
    't-shirt',
    'chemise',
    'blouse',
    'polo',
    'pull',
    'sweat',
    'chaussures',
    'ceinture',
    'manteau'
];

const newItemTemplate = {
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

function MerchAdmin() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    async function loadItems() {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            setFeedback('Impossible de charger les articles.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadItems();
    }, []);

    async function addItem(itemValues) {
        setFeedback('');

        const payload = {
            ...itemValues,
            price: Number(itemValues.price),
            comfort: itemValues.comfort === '' ? null : Number(itemValues.comfort),
            stock: Number(itemValues.stock)
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                setFeedback(error.error || 'Erreur lors de la creation.');
                return false;
            }

            setFeedback('Article ajoute.');
            await loadItems();
            return true;
        } catch (error) {
            setFeedback('Erreur lors de la creation.');
            return false;
        }
    }

    async function saveItem(itemId, itemValues) {
        setFeedback('');

        const payload = {
            ...itemValues,
            price: Number(itemValues.price),
            comfort: itemValues.comfort === '' || itemValues.comfort === null ? null : Number(itemValues.comfort),
            stock: Number(itemValues.stock)
        };

        try {
            const response = await fetch(`${API_URL}/${itemId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                setFeedback(error.error || 'Erreur lors de la mise a jour.');
                return false;
            }

            setFeedback(`Article #${itemId} mis a jour.`);
            await loadItems();
            return true;
        } catch (error) {
            setFeedback('Erreur lors de la mise a jour.');
            return false;
        }
    }

    async function removeItem(id) {
        setFeedback('');
        try {
            const response = await fetch(`${API_URL}/${id}`, {method: 'DELETE'});

            if (!response.ok) {
                const error = await response.json();
                setFeedback(error.error || 'Erreur lors de la suppression.');
                return;
            }

            setFeedback(`Article #${id} supprime.`);
            await loadItems();
        } catch (error) {
            setFeedback('Erreur lors de la suppression.');
        }
    }

    const filteredItems = items.filter((item) =>
        (item.name || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page">
            <Header/>
            <main className="page__content merch-admin">
                <section className="merch-admin__topbar">
                    <h1 className="page__title">Gestion merch</h1>
                    <button className="btn" onClick={() => setIsAddOpen(true)}>AddItem</button>
                </section>

                <section className="page__section merch-admin__panel">
                    <input
                        className="input merch-admin__search"
                        placeholder="Rechercher un item par nom..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    {loading ? <p>Chargement...</p> : null}
                    {feedback ? <p className="merch-admin__feedback">{feedback}</p> : null}

                    <div className="merch-admin__list">
                        {filteredItems.map((item) => (
                            <ListItem
                                key={item.id}
                                item={item}
                                onSave={saveItem}
                                onDelete={removeItem}
                                genres={GENRES}
                                categories={CATEGORIES}
                            />
                        ))}
                        {!loading && filteredItems.length === 0 ? (
                            <p className="merch-admin__empty">Aucun item trouve.</p>
                        ) : null}
                    </div>
                </section>

                <AddItem
                    isOpen={isAddOpen}
                    onClose={() => setIsAddOpen(false)}
                    onSubmit={addItem}
                    genres={GENRES}
                    categories={CATEGORIES}
                    initialValues={newItemTemplate}
                    title="Ajouter un article"
                    submitLabel="Ajouter"
                />
            </main>
            <Footer/>
        </div>
    );
}

export default MerchAdmin;
