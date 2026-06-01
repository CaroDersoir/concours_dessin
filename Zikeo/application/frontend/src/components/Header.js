import '../styles/Header.css';
import logo from "../assets/logo.png";
import iconOption from "../assets/icon_option.png";
import iconLogin from "../assets/icon_login.png";
import {Link} from 'react-router-dom';
import {useContext, useEffect, useRef, useState} from 'react';
import {LanguageContext} from '../context/languageContext';
import {CurrencyContext} from '../context/currencyContext';

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const scrolledRef = useRef(false);
    const {lang} = useContext(LanguageContext);
    const {currency} = useContext(CurrencyContext);
    const [isAdmin, setIsAdmin] = useState(false);

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
            setIsAdmin(localStorage.getItem('isAdmin') === 'true');
        }
    }, []);

    return (
        <header className={`header ${isScrolled ? 'header__scrolled' : ''}`}>
            <div className="header__layout">
                <div className="header__logo__wrap">
                    <img src={logo} alt="Logo" className="header__logo"/>
                </div>
                <nav className="header__nav">
                    <Link className="header__link" to="/">Home</Link>
                    <Link className="header__link" to="/partitions">Partitions</Link>
                    <Link className="header__link" to="/planning">Planning</Link>
                    <Link className="header__link" to="/location">Location</Link>
                    <Link className="header__link" to="/formations">Formations</Link>
                    <div className="header__menu">
                        <button type="button" className="header__link header__menu__trigger">
                            Merch
                        </button>
                        <div className="header__submenu">
                            <Link className="header__submenu__link" to="/merch">Boutique</Link>
                            <Link className="header__submenu__link" to="/promotions">Promotions</Link>
                        </div>
                    </div>
                    {isAdmin && (
                        <div className="header__menu">
                            <button type="button" className="header__link header__menu__trigger">
                                Gestion
                            </button>
                            <div className="header__submenu">
                                <Link className="header__submenu__link" to="/formations">Formations</Link>
                                <Link className="header__submenu__link" to="/partitions">Partitions</Link>
                                <Link className="header__submenu__link" to="/gestion-merch">Merch</Link>
                                <Link className="header__submenu__link" to="/admin/users">Utilisateurs</Link>
                            </div>
                        </div>
                    )}
                </nav>
                <div className="header__actions">
                    <div className="header__action__group">
                        <Link className="header__pill" to="/option?tab=devise">
                            {currency.symbol}
                        </Link>
                        <Link className="header__pill" to="/option?tab=langue">
                            {lang}
                        </Link>
                    </div>
                    <Link className="header__link header__action__btn" to="/option?tab=theme">
                        <img className="header__action__icon" src={iconOption} alt="theme"/>
                        <span className="header__action__label">Option</span>
                    </Link>
                    <Link className="header__link header__action__btn" to="/login">
                        <img className="header__action__icon" src={iconLogin} alt="Login"/>
                        <span className="header__action__label">Login</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
