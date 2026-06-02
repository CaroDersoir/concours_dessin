import ItemMerch from './ItemMerch';
import Cart from './Cart';
import '../styles/Content.css';
import {useContext, useEffect, useState} from 'react';
import {LanguageContext} from '../context/languageContext';

function Content() {
    const {t} = useContext(LanguageContext);
    const [cart, updateCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('zikeo_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('zikeo_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated'));
    }, [cart]);

    return (
        <div className="merch">
            <section className="merch__banner">
                <div className="merch__banner__text">
                    <div className="merch__eyebrow">{t('content_eyebrow')}</div>
                    <p className="merch__subtitle">
                        {t('content_subtitle')}
                    </p>
                </div>
                <div className="merch__banner__card card">
                    <div className="merch__banner__glow"/>
                    <div className="merch__banner__label">{t('content_badge')}</div>
                    <div className="merch__banner__name">{t('content_product_name')}</div>
                    <div className="merch__banner__price">{t('content_price_from')}</div>
                </div>
            </section>

            <div className="merch__layout">
                <div className="merch__products">
                    <ItemMerch cart={cart} updateCart={updateCart}/>
                </div>
                <aside className="merch__cart">
                    <Cart cart={cart} updateCart={updateCart}/>
                </aside>
            </div>
        </div>
    );
}

export default Content;
