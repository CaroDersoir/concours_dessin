/** Panier avec application de code promotionnel **/

import '../styles/Cart.css';
import {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {validatePromoCode} from '../service/promotionServiceFront';
import {LanguageContext} from '../context/languageContext';
import {CurrencyContext} from '../context/currencyContext';

function Cart({cart, updateCart}) {
    const {t} = useContext(LanguageContext);
    const {convert, currency} = useContext(CurrencyContext);
    const history = useHistory();
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');
    const [promoLoading, setPromoLoading] = useState(false);

    const rawTotal = cart.reduce((sum, item) => sum + item.price * item.amount, 0);
    const discount = appliedPromo ? rawTotal * (appliedPromo.discount_percent / 100) : 0;
    const total = rawTotal - discount;

    function increment(item) {
        updateCart(cart.map(i => i.name === item.name ? {...i, amount: i.amount + 1} : i));
    }

    function decrement(item) {
        updateCart(
            cart.map(i => i.name === item.name ? {...i, amount: i.amount - 1} : i)
                .filter(i => i.amount > 0)
        );
    }

    function remove(item) {
        updateCart(cart.filter(i => i.name !== item.name));
    }

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
            const msg = err.response?.data?.error || t('cart_promo_error_default');
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

    function handleOrder() {
        history.push('/checkout', {cart, promo: appliedPromo});
    }

    const sym = currency.symbol;

    return (
        <div className='basket'>
            <div className="basket__header">
                <h2 className="basket__title">{t('cart_title')}</h2>
                <span className="basket__count">{t('cart_count', {count: cart.length})}</span>
            </div>

            <ul className="basket__list">
                {cart.length === 0 && (
                    <li className="basket__empty">{t('cart_empty')}</li>
                )}
                {cart.map(item => (
                    <li className="basket__item" key={item.name}>
                        <div className="basket__name">{item.name}</div>
                        <div className="basket__item__controls">
                            <button type="button" className="basket__qty__btn" onClick={() => decrement(item)}>−</button>
                            <span className="basket__qty">{item.amount}</span>
                            <button type="button" className="basket__qty__btn" onClick={() => increment(item)}>+</button>
                            <span className="basket__item__price">{convert(item.price * item.amount)} {sym}</span>
                            <button type="button" className="basket__remove" onClick={() => remove(item)} aria-label={t('cart_btn_remove')}>✕</button>
                        </div>
                    </li>
                ))}
            </ul>

            {!appliedPromo ? (
                <form className="basket__promo" onSubmit={handleApplyPromo}>
                    <div className="basket__promo__row">
                        <input
                            className="input basket__promo__input"
                            placeholder={t('cart_promo_placeholder')}
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        />
                        <button className="btn basket__promo__btn" type="submit" disabled={promoLoading}>
                            {promoLoading ? '...' : t('cart_promo_apply')}
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
                            {t('cart_promo_remove')}
                        </button>
                    </div>
                    <div className="basket__promo__savings">
                        {t('cart_promo_savings', {amount: convert(discount), symbol: sym})}
                    </div>
                </div>
            )}

            {appliedPromo && (
                <div className="basket__subtotal">
                    {t('cart_subtotal', {subtotal: convert(rawTotal), symbol: sym})}
                </div>
            )}

            <div className="basket__total">
                {t('cart_total', {total: convert(total), symbol: sym})}
            </div>

            <div className="basket__actions">
                {cart.length > 0 && (
                    <button className="btn" onClick={handleOrder}>
                        {t('cart_btn_order')}
                    </button>
                )}
                <button className="btn btn__ghost basket__cta" onClick={() => { updateCart([]); removePromo(); }}>
                    {t('cart_btn_clear')}
                </button>
            </div>
        </div>
    );
}

export default Cart;
