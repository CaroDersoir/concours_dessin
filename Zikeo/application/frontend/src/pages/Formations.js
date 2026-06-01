/** page des prestations musicales : formation musicale et pratique d'instruments **/

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LessonCatalog from '../components/LessonCatalog';
import Cart from '../components/Cart';
import '../styles/Content.css';

function Formations() {
    const [cart, updateCart] = useState(() => {
        try {
            const saved = localStorage.getItem('zikeo_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('zikeo_cart', JSON.stringify(cart));
    }, [cart]);

    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <h1 className="page__title">Formations</h1>
                <div className="merch__layout">
                    <div className="merch__products">
                        <LessonCatalog cart={cart} updateCart={updateCart}/>
                    </div>
                    <aside className="merch__cart">
                        <Cart cart={cart} updateCart={updateCart}/>
                    </aside>
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default Formations;
