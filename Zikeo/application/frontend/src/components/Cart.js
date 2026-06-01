/** Panier avec application de code promotionnel **/

import '../styles/Cart.css';
import {useState} from 'react';
import {validatePromoCode} from '../service/promotionServiceFront';

function Cart({cart, updateCart}) {
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');
    const [promoLoading, setPromoLoading] = useState(false);

    const rawTotal = cart.reduce((sum, item) => sum + item.price * item.amount, 0);

    const discount = appliedPromo
        ? rawTotal * (appliedPromo.discount_percent / 100)
        : 0;

    const total = rawTotal - discount;

    async function handleApplyPromo(e) {
        e.preventDefault();
        if (!promoCode.trim()) return;
        setPromoError('');
        setPromoLoading(true);
        try {
            const result = await validatePromoCode(promoCode.trim());
            if (result.valid) {
                setAppliedPromo(result.promotion);
                setPromoError('');
            }
        } catch (err) {
            const msg = err.response?.data?.error || 'Code invalide';
            setPromoError(msg);
            setAppliedPromo(null);
        } finally {
            setPromoLoading(false);
        }
    }

    function removePromo() {
        setAppliedPromo(null);
        setPromoCode('');
        setPromoError('');
    }

    return (
        <div className='basket'>
            <div className="basket__header">
                <h2 className="basket__title">Panier</h2>
                <span className="basket__count">{cart.length} items</span>
            </div>

            <ul className="basket__list">
                {cart.length === 0 && (
                    <li className="basket__empty">Votre panier est vide.</li>
                )}
                {cart.map(item => (
                    <li className="basket__item" key={item.name}>
                        <div className="basket__name">{item.name}</div>
                        <div className="basket__line">{item.price} € x {item.amount}</div>
                    </li>
                ))}
            </ul>

            {/* Code promotionnel */}
            {!appliedPromo ? (
                <form className="basket__promo" onSubmit={handleApplyPromo}>
                    <div className="basket__promo__row">
                        <input
                            className="input basket__promo__input"
                            placeholder="Code promo"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        />
                        <button className="btn basket__promo__btn" type="submit" disabled={promoLoading}>
                            {promoLoading ? '...' : 'Appliquer'}
                        </button>
                    </div>
                    {promoError && <p className="basket__promo__error">{promoError}</p>}
                </form>
            ) : (
                <div className="basket__promo__applied">
                    <div className="basket__promo__applied__info">
                        <span className="basket__promo__applied__label">
                            {appliedPromo.name} — -{appliedPromo.discount_percent}%
                        </span>
                        <button type="button" className="basket__promo__remove" onClick={removePromo}>
                            Retirer
                        </button>
                    </div>
                    <div className="basket__promo__savings">
                        Économie : -{discount.toFixed(2)} €
                    </div>
                </div>
            )}

            {appliedPromo && (
                <div className="basket__subtotal">
                    Sous-total : {rawTotal.toFixed(2)} €
                </div>
            )}

            <div className="basket__total">
                Total : {total.toFixed(2)} €
            </div>

            <button className="btn basket__cta" onClick={() => {
                updateCart([]);
                removePromo();
            }}>
                Vider le panier
            </button>
        </div>
    );
}

export default Cart;
