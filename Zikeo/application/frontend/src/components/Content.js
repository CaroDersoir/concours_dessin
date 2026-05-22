import ItemMerch from './ItemMerch';
import Cart from './Cart';
import '../styles/Content.css';
import {useEffect, useState} from 'react';

function Content() {
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
    }, [cart]);

    return (
        <div className="merch">
            <section className="merch__banner">
                <div className="merch__banner__text">
                    <div className="merch__eyebrow">Collection</div>
                    <p className="merch__subtitle">
                        Pieces limites, textures confort et vibes neon pour la scene.
                    </p>
                    <div className="merch__actions">
                        <button className="btn">Decouvrir</button>
                        <button className="btn btn--ghost">Voir le panier</button>
                    </div>
                </div>
                <div className="merch__banner__card card">
                    <div className="merch__banner__glow"/>
                    <div className="merch__banner__label">Drop #01</div>
                    <div className="merch__banner__name">Neo Wave</div>
                    <div className="merch__banner__price">A partir de 8 €</div>
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
