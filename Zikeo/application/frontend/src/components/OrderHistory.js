// Composant historique des commandes de l'utilisateur connecté
import {useEffect, useState, useContext} from 'react';
import {getMyOrders} from '../service/orderServiceFront';
import {LanguageContext} from '../context/languageContext';

const STEPS = ['en_traitement', 'en_transit', 'livre'];

function OrderTracker({status, t}) {
    const currentIndex = STEPS.indexOf(status);
    return (
        <div className="order-tracker">
            {STEPS.map((step, i) => (
                <div key={step} className={`order-tracker__step ${i <= currentIndex ? 'order-tracker__step--done' : ''}`}>
                    <div className="order-tracker__dot"/>
                    <span className="order-tracker__label">{t(`order_tracking_${step}`)}</span>
                    {i < STEPS.length - 1 && (
                        <div className={`order-tracker__line ${i < currentIndex ? 'order-tracker__line--done' : ''}`}/>
                    )}
                </div>
            ))}
        </div>
    );
}

function OrderHistory() {
    const {t} = useContext(LanguageContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getMyOrders()
            .then(setOrders)
            .catch(() => setError(t('order_history_error_load')))
            .finally(() => setLoading(false));
    }, [t]);

    const PAYMENT_LABELS = {carte: 'Carte bancaire', paypal: 'PayPal', virement: 'Virement bancaire'};

    return (
        <div className="profile">
            <div className="profile__card">
                <div className="profile__header">
                    <h2 className="profile__title">{t('order_history_title')}</h2>
                </div>

                {loading && <p className="profile__empty">{t('order_history_loading')}</p>}
                {error && <p className="profile__error">{error}</p>}

                {!loading && !error && orders.length === 0 && (
                    <p className="profile__empty">{t('order_history_empty')}</p>
                )}

                {orders.map(order => (
                    <div key={order.id} className="order-history__card">
                        <div className="order-history__header">
                            <span className="order-history__number">{t('order_history_number', {number: order.order_number})}</span>
                            <span className="order-history__date">
                                {new Date(order.created_at).toLocaleDateString('fr-FR', {day: '2-digit', month: 'long', year: 'numeric'})}
                            </span>
                        </div>

                        <OrderTracker status={order.status} t={t}/>

                        <ul className="order-history__items">
                            {(order.items || []).map(item => (
                                <li key={item.id} className="order-history__item">
                                    {item.item_name} <span className="order-history__item__qty">x{item.quantity}</span>
                                    <span className="order-history__item__price"> — {(item.item_price * item.quantity).toFixed(2)} €</span>
                                </li>
                            ))}
                        </ul>

                        <div className="order-history__footer">
                            {order.promo_code && (
                                <span className="order-history__promo">{t('order_history_promo', {code: order.promo_code, pct: order.discount_percent})}</span>
                            )}
                            <span className="order-history__total">{t('order_history_total', {total: Number(order.total_ttc).toFixed(2)})}</span>
                            <span className="order-history__payment">{PAYMENT_LABELS[order.payment_method] || order.payment_method}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrderHistory;
