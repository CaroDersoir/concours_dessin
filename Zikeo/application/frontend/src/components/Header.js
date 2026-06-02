import '../styles/Header.css';
import logo from "../assets/logo.png";
import {Link} from 'react-router-dom';
import {useContext, useEffect, useRef, useState} from 'react';
import {LanguageContext} from '../context/languageContext';
import {CurrencyContext} from '../context/currencyContext';
import Cart from './Cart';

function readCart() {
    try {
        const raw = localStorage.getItem('zikeo_cart');
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const scrolledRef = useRef(false);
    const {lang, t} = useContext(LanguageContext);
    const {currency} = useContext(CurrencyContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cart, setCart] = useState(readCart);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const cartCount = cart.reduce((sum, i) => sum + (i.amount ?? 0), 0);

    useEffect(() => {
        function handleScroll() {
            const y = window.scrollY;
            if (!scrolledRef.current && y > 60) {
                scrolledRef.current = true;
                setIsScrolled(true);
            } else if (scrolledRef.current && y < 20) {
                scrolledRef.current = false;
                setIsScrolled(false);
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            setIsAdmin(localStorage.getItem('isAdmin') === 'true');
        }
    }, []);

    useEffect(() => {
        const refresh = () => setCart(readCart());
        window.addEventListener('cart-updated', refresh);
        window.addEventListener('storage', refresh);
        return () => {
            window.removeEventListener('cart-updated', refresh);
            window.removeEventListener('storage', refresh);
        };
    }, []);

    function updateCart(newCart) {
        setCart(newCart);
        localStorage.setItem('zikeo_cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cart-updated'));
    }

    return (<>
        <header className={`header ${isScrolled ? 'header__scrolled' : ''}`}>
            <div className="header__layout">
                <div className="header__logo__wrap">
                    <img src={logo} alt={t('header_logo_alt')} className="header__logo"/>
                </div>
                <nav className="header__nav">
                    <Link className="header__link" to="/">{t('nav_home')}</Link>
                    <Link className="header__link" to="/partitions">{t('nav_partitions')}</Link>
                    <Link className="header__link" to="/planning">{t('nav_planning')}</Link>
                    <Link className="header__link" to="/location">{t('nav_location')}</Link>
                    <Link className="header__link" to="/formations">{t('nav_formations')}</Link>
                    <div className="header__menu">
                        <button type="button" className="header__link header__menu__trigger">
                            {t('nav_merch')}
                        </button>
                        <div className="header__submenu">
                            <Link className="header__submenu__link" to="/merch">{t('nav_boutique')}</Link>
                            <Link className="header__submenu__link" to="/promotions">{t('nav_promotions')}</Link>
                        </div>
                    </div>
                    {isAdmin && (
                        <div className="header__menu">
                            <button type="button" className="header__link header__menu__trigger">
                                {t('nav_gestion')}
                            </button>
                            <div className="header__submenu">
                                <Link className="header__submenu__link" to="/admin/home">{t('nav_submenu_home')}</Link>
                                <Link className="header__submenu__link"
                                      to="/admin/notifications">{t('nav_submenu_notifications')}</Link>
                                <Link className="header__submenu__link"
                                      to="/admin/commandes">{t('nav_submenu_commandes')}</Link>
                                <Link className="header__submenu__link"
                                      to="/gestion-formations">{t('nav_submenu_formations')}</Link>
                                <Link className="header__submenu__link"
                                      to="/gestion-merch">{t('nav_submenu_merch')}</Link>
                                <Link className="header__submenu__link"
                                      to="/admin/users">{t('nav_submenu_users')}</Link>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Actions : icônes en mode normal, sous-menus en mode rétréci */}
                {!isScrolled ? (
                    <div className="header__actions">
                        <button type="button" className="header__pill" onClick={() => setIsCartOpen(true)}>
                            <span className="material-symbols-outlined">shopping_cart</span>
                            {cartCount > 0 &&
                                <span className="header__cart__badge header__cart__badge--inline">{cartCount}</span>}
                        </button>
                        <div className="header__action__group">
                            <Link className="header__pill" to="/option?tab=devise">{currency.symbol}</Link>
                            <Link className="header__pill" to="/option?tab=langue">{lang}</Link>
                        </div>
                        <div className="header__action__group">
                            <Link className="header__link header__action__btn header__btn--paint"
                                  to="/option?tab=theme">
                                <span className="material-symbols-outlined header__action__icon">format_paint</span>
                                <span className="header__action__label">{t('header_label_pref')}</span>
                            </Link>
                            <Link className="header__link header__action__btn header__btn--account" to="/login">
                                <span className="material-symbols-outlined header__action__icon">account_circle</span>
                                <span className="header__action__label">{t('header_label_login')}</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="header__actions header__actions--compact">
                        <div className="header__menu">
                            <Link className="header__link header__action__btn header__btn--paint"
                                  to="/option?tab=theme">
                                <span className="material-symbols-outlined header__action__icon">format_paint</span>
                            </Link>
                            <div className="header__submenu header__submenu--right">
                                <Link className="header__submenu__link" to="/option?tab=langue">
                                    <span className="header__submenu__badge">{lang}</span>
                                    {t('header_submenu_langue')}
                                </Link>
                                <Link className="header__submenu__link" to="/option?tab=devise">
                                    <span className="header__submenu__badge">{currency.symbol}</span>
                                    {t('header_submenu_devise')}
                                </Link>
                                <Link className="header__submenu__link" to="/option?tab=theme">
                                    {t('header_icon_pref_alt')}
                                </Link>
                            </div>
                        </div>
                        <div className="header__menu">
                            <Link className="header__link header__action__btn header__btn--account"
                                  to={isLoggedIn ? '/profile' : '/login'}>
                                <span className="material-symbols-outlined header__action__icon">account_circle</span>
                            </Link>
                            <div className="header__submenu header__submenu--right">
                                <button type="button" className="header__submenu__link" onClick={() => setIsCartOpen(true)}>
                                    <span className="material-symbols-outlined header__submenu__cart__icon">shopping_cart</span>
                                    {t('header_submenu_cart')}
                                    {cartCount > 0 && <span className="header__submenu__badge">{cartCount}</span>}
                                </button>
                                <Link className="header__submenu__link" to={isLoggedIn ? '/profile' : '/login'}>
                                    {isLoggedIn ? t('header_submenu_account') : t('header_label_login')}
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>

        {isCartOpen && (
            <div className="cart-modal__overlay" onClick={() => setIsCartOpen(false)}>
                <div className="cart-modal" onClick={e => e.stopPropagation()}>
                    <button type="button" className="cart-modal__close" onClick={() => setIsCartOpen(false)} aria-label="Fermer">✕</button>
                    <Cart cart={cart} updateCart={updateCart}/>
                </div>
            </div>
        )}
    </>
    );
}

export default Header;
