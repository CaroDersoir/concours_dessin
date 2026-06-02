// Page de commande : saisie livraison → récapitulatif → confirmation
import {useState, useEffect, useContext} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {getProfile} from '../service/customerServiceFront';
import {createOrder} from '../service/orderServiceFront';
import {CurrencyContext} from '../context/currencyContext';
import {LanguageContext} from '../context/languageContext';
import '../styles/Checkout.css';

const PAYMENT_LABELS = {carte: 'Carte bancaire', paypal: 'PayPal', virement: 'Virement bancaire'};

function Checkout() {
    const {t} = useContext(LanguageContext);
    const {convert, currency} = useContext(CurrencyContext);
    const location = useLocation();
    const history = useHistory();

    const cart = location.state?.cart ?? [];
    const promo = location.state?.promo ?? null;

    const [step, setStep] = useState('shipping'); // 'shipping' | 'summary' | 'success'
    const [shipping, setShipping] = useState({
        contact_nom: '',
        contact_email: '',
        contact_telephone: '',
        adresse_livraison: '',
        payment_method: 'carte'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderNumber, setOrderNumber] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;
        getProfile()
            .then(profile => setShipping(prev => ({
                ...prev,
                contact_nom: `${profile.prenom || ''} ${profile.nom || ''}`.trim(),
                contact_email: profile.email || '',
                contact_telephone: profile.telephone || '',
                adresse_livraison: profile.adresse_livraison || profile.adresse || '',
                payment_method: profile.preferences_paiement || 'carte'
            })))
            .catch(() => {});
    }, [token]);

    const rawTotal = cart.reduce((sum, i) => sum + i.price * i.amount, 0);
    const discountPct = promo?.discount_percent ?? 0;
    const discountAmount = rawTotal * (discountPct / 100);
    const total = rawTotal - discountAmount;

    function setField(field) {
        return (e) => setShipping(prev => ({...prev, [field]: e.target.value}));
    }

    function handleShippingSubmit(e) {
        e.preventDefault();
        setStep('summary');
    }

    async function handleConfirm() {
        if (!token) {
            setError(t('checkout_login_required'));
            return;
        }
        setLoading(true);
        setError('');
        try {
            const payload = {
                shipping,
                cart: cart.map(i => ({id: i.id, name: i.name, price: i.price, quantity: i.amount})),
                promo: promo ? {code: promo.code, discount_percent: promo.discount_percent} : null
            };
            const order = await createOrder(payload);
            setOrderNumber(order.order_number);
            localStorage.removeItem('zikeo_cart');
            window.dispatchEvent(new Event('cart-updated'));
            setStep('success');
        } catch (err) {
            setError(t('checkout_error'));
        } finally {
            setLoading(false);
        }
    }

    if (cart.length === 0 && step !== 'success') {
        return (
            <div className="page">
                <Header/>
                <main className="page__content checkout">
                    <p className="checkout__empty">{t('cart_empty')}</p>
                    <button className="btn" onClick={() => history.push('/merch')}>{t('checkout_back_shop')}</button>
                </main>
                <Footer/>
            </div>
        );
    }

    return (
        <div className="page">
            <Header/>
            <main className="page__content checkout">
                <h1 className="checkout__title">{t('checkout_title')}</h1>

                {step !== 'success' && (
                    <div className="checkout__steps">
                        <span className={`checkout__step${step === 'shipping' ? ' checkout__step--active' : ''}`}>
                            1. {t('checkout_step_shipping')}
                        </span>
                        <span className="checkout__step__sep">›</span>
                        <span className={`checkout__step${step === 'summary' ? ' checkout__step--active' : ''}`}>
                            2. {t('checkout_step_summary')}
                        </span>
                    </div>
                )}

                {step === 'shipping' && (
                    <form className="checkout__form" onSubmit={handleShippingSubmit}>
                        <div className="checkout__field">
                            <label className="checkout__label">{t('checkout_label_nom')}</label>
                            <input className="input" value={shipping.contact_nom} onChange={setField('contact_nom')} required/>
                        </div>
                        <div className="checkout__field">
                            <label className="checkout__label">{t('checkout_label_email')}</label>
                            <input className="input" type="email" value={shipping.contact_email} onChange={setField('contact_email')} required/>
                        </div>
                        <div className="checkout__field">
                            <label className="checkout__label">{t('checkout_label_telephone')}</label>
                            <input className="input" value={shipping.contact_telephone} onChange={setField('contact_telephone')}/>
                        </div>
                        <div className="checkout__field">
                            <label className="checkout__label">{t('checkout_label_adresse')}</label>
                            <input className="input" value={shipping.adresse_livraison} onChange={setField('adresse_livraison')} required/>
                        </div>
                        <div className="checkout__field">
                            <label className="checkout__label">{t('checkout_label_payment')}</label>
                            <select className="input" value={shipping.payment_method} onChange={setField('payment_method')}>
                                <option value="carte">{t('checkout_payment_carte')}</option>
                                <option value="paypal">{t('checkout_payment_paypal')}</option>
                                <option value="virement">{t('checkout_payment_virement')}</option>
                            </select>
                        </div>
                        <div className="checkout__actions">
                            <button type="button" className="btn btn__ghost" onClick={() => history.goBack()}>{t('checkout_btn_back')}</button>
                            <button type="submit" className="btn">{t('checkout_btn_continue')}</button>
                        </div>
                    </form>
                )}

                {step === 'summary' && (
                    <div className="checkout__summary">
                        <section className="checkout__section">
                            <h2 className="checkout__section__title">{t('checkout_summary_items')}</h2>
                            <ul className="checkout__items">
                                {cart.map(item => (
                                    <li key={item.name} className="checkout__item">
                                        <span className="checkout__item__name">{item.name}</span>
                                        <span className="checkout__item__qty">x{item.amount}</span>
                                        <span className="checkout__item__price">{convert(item.price * item.amount)} {currency.symbol}</span>
                                    </li>
                                ))}
                            </ul>
                            {promo && (
                                <div className="checkout__promo">
                                    {t('checkout_summary_promo')} : <strong>{promo.code}</strong> (-{promo.discount_percent}%) — -{convert(discountAmount)} {currency.symbol}
                                </div>
                            )}
                            <div className="checkout__total">
                                {t('checkout_summary_total')} : <strong>{convert(total)} {currency.symbol}</strong>
                            </div>
                        </section>

                        <section className="checkout__section">
                            <h2 className="checkout__section__title">{t('checkout_summary_shipping')}</h2>
                            <p>{shipping.contact_nom}</p>
                            <p>{shipping.contact_email}</p>
                            {shipping.contact_telephone && <p>{shipping.contact_telephone}</p>}
                            <p>{shipping.adresse_livraison}</p>
                        </section>

                        <section className="checkout__section">
                            <h2 className="checkout__section__title">{t('checkout_summary_payment')}</h2>
                            <p>{PAYMENT_LABELS[shipping.payment_method] || shipping.payment_method}</p>
                        </section>

                        {error && <p className="checkout__error">{error}</p>}

                        <div className="checkout__actions">
                            <button type="button" className="btn btn__ghost" onClick={() => setStep('shipping')}>{t('checkout_btn_back')}</button>
                            <button type="button" className="btn" onClick={handleConfirm} disabled={loading}>
                                {loading ? t('checkout_btn_confirming') : t('checkout_btn_confirm')}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="checkout__success">
                        <div className="checkout__success__icon">✓</div>
                        <h2 className="checkout__success__title">{t('checkout_success_title')}</h2>
                        <p className="checkout__success__number">{t('checkout_success_order_number', {number: orderNumber})}</p>
                        <p className="checkout__success__email">{t('checkout_success_email', {email: shipping.contact_email})}</p>
                        <div className="checkout__actions">
                            <button className="btn btn__ghost" onClick={() => history.push('/merch')}>{t('checkout_success_btn_home')}</button>
                            <button className="btn" onClick={() => history.push('/profile')}>{t('checkout_success_btn_profile')}</button>
                        </div>
                    </div>
                )}
            </main>
            <Footer/>
        </div>
    );
}

export default Checkout;
