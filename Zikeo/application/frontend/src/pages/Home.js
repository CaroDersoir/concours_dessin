import Header from '../components/Header';
import Footer from '../components/Footer';
import {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {LanguageContext} from '../context/languageContext';
import {CurrencyContext} from '../context/currencyContext';
import {usePageLoading} from '../context/loadingContext';
import {getAllReservations} from '../service/reservationServiceFront';
import {getMyOrders} from '../service/orderServiceFront';
import {getHomeCards} from '../service/homeCardServiceFront';
import '../styles/Home.css';

function CardLink({card, children}) {
    if (card.url) return <Link className="home__card" to={card.url}>{children}</Link>;
    return <div className="home__card home__card--news">{children}</div>;
}

function HomeCard({card, todayCount, orderCount, isLoggedIn}) {
    const {t} = useContext(LanguageContext);
    const {convert, currency} = useContext(CurrencyContext);

    if (card.type === 'item' && card.item) {
        const cover = card.item.covers?.[0];
        return (
            <Link className="home__card home__card--item" to="/merch">
                {cover
                    ? <img className="home__card__item-img" src={cover} alt={card.item.name}/>
                    : <div className="home__card__item-placeholder"/>
                }
                <p className="home__card__title">{card.item.name}</p>
                <p className="home__card__price">{convert(card.item.price)} {currency.symbol}</p>
                <span className="home__card__arrow">→</span>
            </Link>
        );
    }

    const isPlanningCard = card.url === '/planning';
    const isOrderCard    = card.url === '/profile' && card.type === 'link';
    const isLoginCard    = card.url === '/login';

    let stat = null;
    let sub  = card.subtitle;

    if (isPlanningCard && todayCount !== null) {
        stat = todayCount > 0 ? todayCount : null;
        sub  = todayCount > 0
            ? t('home_card_planning_events', {count: todayCount})
            : t('home_card_planning_empty');
    }

    if (isLoginCard && !isLoggedIn) {
        sub = t('home_card_login_sub');
    }

    if (isOrderCard && isLoggedIn && orderCount !== null) {
        stat = orderCount > 0 ? orderCount : null;
        sub  = orderCount > 0
            ? t('home_card_orders_count', {count: orderCount})
            : t('home_card_orders_empty');
    }

    return (
        <CardLink card={card}>
            {card.icon && <span className="home__card__icon">{card.icon}</span>}
            {stat !== null && <span className="home__card__stat">{stat}</span>}
            <p className="home__card__title">{card.title}</p>
            {sub && <p className="home__card__sub">{sub}</p>}
            {card.url && <span className="home__card__arrow">→</span>}
        </CardLink>
    );
}

function Home() {
    const {t} = useContext(LanguageContext);
    const {setLoading} = usePageLoading();
    const isLoggedIn = !!localStorage.getItem('token');

    const [cards, setCards]           = useState([]);
    const [todayCount, setTodayCount] = useState(null);
    const [orderCount, setOrderCount] = useState(null);

    useEffect(() => {
        setLoading(true);
        const today = new Date().toISOString().slice(0, 10);

        const fetches = [
            getHomeCards().then(setCards).catch(() => setCards([])),
            getAllReservations()
                .then(data => setTodayCount(
                    data.filter(r => r.statut !== 'refusee' && r.date?.slice(0, 10) === today).length
                ))
                .catch(() => setTodayCount(0)),
        ];

        if (isLoggedIn) {
            fetches.push(
                getMyOrders()
                    .then(data => setOrderCount(data.length))
                    .catch(() => setOrderCount(0))
            );
        }

        const delay = new Promise(resolve => setTimeout(resolve, 2200));
        Promise.all([...fetches, delay]).finally(() => setLoading(false));
        return () => setLoading(false);
    }, []);

    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <div className="home__hero">
                    <h1 className="page__title">{t('home_title')}</h1>
                    <p className="home__subtitle">{t('home_welcome')}</p>
                </div>

                <div className="home__cards">
                    {cards.map(card => (
                        <HomeCard
                            key={card.id}
                            card={card}
                            todayCount={todayCount}
                            orderCount={orderCount}
                            isLoggedIn={isLoggedIn}
                        />
                    ))}
                    {cards.length === 0 && (
                        <p className="home__empty">{t('home_empty')}</p>
                    )}
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default Home;
