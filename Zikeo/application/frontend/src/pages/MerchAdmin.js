import {useEffect, useState} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ItemEdit from '../components/ItemEdit';
import ListItem from '../components/ListItem';
import {deleteItem, getAllItems} from '../service/itemsServiceFront';
import '../styles/MerchAdmin.css';

function MerchAdmin() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    async function loadItems() {
        setLoading(true);
        try {
            const data = await getAllItems();
            setItems(data);
        } catch (error) {
            setFeedback('Impossible de charger les articles.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadItems();
    }, []);

    async function removeItem(id) {
        setFeedback('');
        try {
            await deleteItem(id);
            setFeedback(`Article #${id} supprimé.`);
            await loadItems();
        } catch (error) {
            setFeedback(error.message);
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
                    <button className="btn" onClick={() => setIsAddOpen(true)}>Ajouter</button>
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
                                onSaved={loadItems}
                                onDelete={removeItem}
                            />
                        ))}
                        {!loading && filteredItems.length === 0 ? (
                            <p className="merch-admin__empty">Aucun item trouvé.</p>
                        ) : null}
                    </div>
                </section>

                <ItemEdit
                    isOpen={isAddOpen}
                    onClose={() => setIsAddOpen(false)}
                    onSaved={loadItems}
                />
            </main>
            <Footer/>
        </div>
    );
}

export default MerchAdmin;