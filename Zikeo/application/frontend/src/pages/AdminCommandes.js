// Page admin commandes — liste, détail articles, gestion des statuts
import { useState, useEffect, useCallback, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllOrders, updateOrderStatus } from '../service/orderServiceFront';
import { LanguageContext } from '../context/languageContext';
import '../styles/AdminCommandes.css';

const STATUTS = ['en_traitement', 'en_transit', 'livre'];

const STATUT_CLASS = {
    en_traitement: 'cmd__badge--en-traitement',
    en_transit:    'cmd__badge--en-transit',
    livre:         'cmd__badge--livre'
};

const PAYMENT_LABELS = {
    carte: 'Carte bancaire',
    paypal: 'PayPal',
    virement: 'Virement bancaire'
};

function customerName(order) {
    return order.customer_prenom || order.customer_nom
        ? `${order.customer_prenom || ''} ${order.customer_nom || ''}`.trim()
        : order.customer_email || order.contact_nom || '—';
}

function AdminCommandes() {
    const { t } = useContext(LanguageContext);
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    const [orders, setOrders]           = useState([]);
    const [filter, setFilter]           = useState('all');
    const [search, setSearch]           = useState('');
    const [expanded, setExpanded]       = useState(null);
    const [feedback, setFeedback]       = useState('');
    const [loading, setLoading]         = useState(true);

    const load = useCallback(async () => {
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAdmin) load();
        else setLoading(false);
    }, [isAdmin, load]);

    async function handleStatus(id, status) {
        try {
            await updateOrderStatus(id, status);
            setFeedback(t('admin_orders_updated'));
            load();
        } catch {
            setFeedback(t('planning_admin_error'));
        }
    }

    const filtered = orders.filter(o => {
        if (filter !== 'all' && o.status !== filter) return false;
        if (search) {
            const q = search.toLowerCase();
            const name = customerName(o).toLowerCase();
            return name.includes(q) || o.order_number.toLowerCase().includes(q);
        }
        return true;
    });

    const counts = {
        all:           orders.length,
        en_traitement: orders.filter(o => o.status === 'en_traitement').length,
        en_transit:    orders.filter(o => o.status === 'en_transit').length,
        livre:         orders.filter(o => o.status === 'livre').length,
    };

    if (!isAdmin) {
        return (
            <div className="page">
                <Header/>
                <main className="page__content"><p>Accès refusé.</p></main>
                <Footer/>
            </div>
        );
    }

    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <h1 className="page__title">{t('admin_orders_title')}</h1>

                {feedback && (
                    <p className="cmd__feedback" onClick={() => setFeedback('')}>{feedback}</p>
                )}

                {/* Cartes de synthèse */}
                {!loading && (
                    <div className="cmd__summary">
                        <div className="cmd__card cmd__card--total">
                            <span className="cmd__card-count">{counts.all}</span>
                            <span className="cmd__card-label">{t('admin_orders_card_total')}</span>
                        </div>
                        <div className={`cmd__card cmd__card--en-traitement ${counts.en_traitement === 0 ? 'cmd__card--zero' : ''}`}>
                            <span className="cmd__card-count">{counts.en_traitement}</span>
                            <span className="cmd__card-label">{t('admin_orders_card_en_traitement')}</span>
                        </div>
                        <div className={`cmd__card cmd__card--en-transit ${counts.en_transit === 0 ? 'cmd__card--zero' : ''}`}>
                            <span className="cmd__card-count">{counts.en_transit}</span>
                            <span className="cmd__card-label">{t('admin_orders_card_en_transit')}</span>
                        </div>
                        <div className={`cmd__card cmd__card--livre ${counts.livre === 0 ? 'cmd__card--zero' : ''}`}>
                            <span className="cmd__card-count">{counts.livre}</span>
                            <span className="cmd__card-label">{t('admin_orders_card_livre')}</span>
                        </div>
                    </div>
                )}

                {/* Filtres */}
                <div className="cmd__filters">
                    <div className="cmd__filter-tabs">
                        {['all', ...STATUTS].map(s => (
                            <button
                                key={s}
                                className={`cmd__filter-tab ${filter === s ? 'cmd__filter-tab--active' : ''}`}
                                onClick={() => setFilter(s)}
                            >
                                {s === 'all' ? t('admin_orders_filter_all') : t(`admin_orders_status_${s}`)}
                                <span className="cmd__filter-count">{s === 'all' ? counts.all : counts[s]}</span>
                            </button>
                        ))}
                    </div>
                    <input
                        className="input cmd__search"
                        placeholder="Rechercher client ou n° commande..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Tableau */}
                {loading ? (
                    <p className="cmd__empty">{t('planning_loading')}</p>
                ) : filtered.length === 0 ? (
                    <p className="cmd__empty">{t('admin_orders_empty')}</p>
                ) : (
                    <div className="cmd__table-wrap">
                        <table className="cmd__table">
                            <thead>
                                <tr>
                                    <th>{t('admin_orders_col_number')}</th>
                                    <th>{t('admin_orders_col_customer')}</th>
                                    <th>{t('admin_orders_col_date')}</th>
                                    <th>{t('admin_orders_col_items')}</th>
                                    <th>{t('admin_orders_col_total')}</th>
                                    <th>{t('admin_orders_col_payment')}</th>
                                    <th>{t('admin_orders_col_status')}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(order => (
                                    <>
                                        <tr
                                            key={order.id}
                                            className={`cmd__row ${expanded === order.id ? 'cmd__row--expanded' : ''}`}
                                            onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                        >
                                            <td className="cmd__order-number">{order.order_number}</td>
                                            <td>
                                                <div className="cmd__customer">
                                                    <span>{customerName(order)}</span>
                                                    {order.customer_email && (
                                                        <span className="cmd__customer-email">{order.customer_email}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="cmd__date">
                                                {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="cmd__items-count">
                                                {(order.items || []).length}
                                            </td>
                                            <td className="cmd__total">
                                                {Number(order.total_ttc).toFixed(2)} €
                                                {order.discount_percent > 0 && (
                                                    <span className="cmd__promo">-{order.discount_percent}%</span>
                                                )}
                                            </td>
                                            <td>{PAYMENT_LABELS[order.payment_method] || order.payment_method}</td>
                                            <td onClick={e => e.stopPropagation()}>
                                                <select
                                                    className={`cmd__status-select cmd__status-select--${order.status}`}
                                                    value={order.status}
                                                    onChange={e => handleStatus(order.id, e.target.value)}
                                                >
                                                    {STATUTS.map(s => (
                                                        <option key={s} value={s}>{t(`admin_orders_status_${s}`)}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="cmd__expand-icon">
                                                {expanded === order.id ? '▲' : '▼'}
                                            </td>
                                        </tr>

                                        {/* Détail articles */}
                                        {expanded === order.id && (
                                            <tr key={`detail-${order.id}`} className="cmd__detail-row">
                                                <td colSpan={8}>
                                                    <div className="cmd__detail">
                                                        <div className="cmd__detail-grid">
                                                            <div className="cmd__detail-block">
                                                                <h4 className="cmd__detail-subtitle">{t('admin_orders_items_title')}</h4>
                                                                <table className="cmd__items-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>{t('admin_orders_col_item_name')}</th>
                                                                            <th>{t('admin_orders_col_item_price')}</th>
                                                                            <th>{t('admin_orders_col_item_qty')}</th>
                                                                            <th>{t('admin_orders_col_item_subtotal')}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {(order.items || []).map(item => (
                                                                            <tr key={item.id}>
                                                                                <td>{item.item_name}</td>
                                                                                <td>{Number(item.item_price).toFixed(2)} €</td>
                                                                                <td>{item.quantity}</td>
                                                                                <td>{(item.item_price * item.quantity).toFixed(2)} €</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            <div className="cmd__detail-block">
                                                                <h4 className="cmd__detail-subtitle">{t('admin_orders_shipping')}</h4>
                                                                <dl className="cmd__detail-dl">
                                                                    <dt>{t('admin_users_col_nom')}</dt>
                                                                    <dd>{order.contact_nom || '—'}</dd>
                                                                    <dt>Email</dt>
                                                                    <dd>{order.contact_email || '—'}</dd>
                                                                    <dt>{t('profile_label_telephone')}</dt>
                                                                    <dd>{order.contact_telephone || '—'}</dd>
                                                                    <dt>{t('profile_label_adresse_livraison')}</dt>
                                                                    <dd>{order.adresse_livraison || '—'}</dd>
                                                                </dl>
                                                                {order.promo_code && (
                                                                    <p className="cmd__promo-line">
                                                                        {t('admin_orders_promo')} : <strong>{order.promo_code}</strong> (-{order.discount_percent}%)
                                                                    </p>
                                                                )}
                                                                <p className="cmd__total-line">
                                                                    {t('admin_orders_col_total')} : <strong>{Number(order.total_ttc).toFixed(2)} €</strong>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
            <Footer/>
        </div>
    );
}

export default AdminCommandes;
