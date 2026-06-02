import {useContext, useEffect, useState} from 'react';
import '../styles/Item.css';
import {CurrencyContext} from '../context/currencyContext';

function ImageCarousel({covers, name}) {
    const [index, setIndex] = useState(0);
    const count = covers.length;

    if (count === 0) return <div className="item__catalog__media__placeholder"/>;

    const prev = (e) => {
        e.stopPropagation();
        setIndex(i => (i - 1 + count) % count);
    };
    const next = (e) => {
        e.stopPropagation();
        setIndex(i => (i + 1) % count);
    };

    return (
        <div className="item__carousel">
            <img src={covers[index]} alt={`${name} ${index + 1}`} className="item__carousel__img"/>
            {count > 1 && (
                <>
                    <button type="button" className="item__carousel__arrow item__carousel__arrow--prev"
                            onClick={prev}>&#8249;</button>
                    <button type="button" className="item__carousel__arrow item__carousel__arrow--next"
                            onClick={next}>&#8250;</button>
                    <div className="item__carousel__dots">
                        {covers.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`item__carousel__dot${i === index ? ' item__carousel__dot--active' : ''}`}
                                onClick={e => {
                                    e.stopPropagation();
                                    setIndex(i);
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function Item({item, addToCart}) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const {convert, currency} = useContext(CurrencyContext);

    const sizes = item.sizes ?? [];

    useEffect(() => {
        if (!isDetailOpen) return;
        setSelectedSize(sizes.length > 0 ? sizes[0] : null);
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setIsDetailOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isDetailOpen]);

    const outOfStock = selectedSize ? selectedSize.stock === 0 : sizes.every(s => s.stock === 0);

    return (
        <li className='catalog__card' key={item.id ?? item.name}>
            <div className="item__catalog">
                <button
                    type="button"
                    className="item__catalog__media item__catalog__media__button"
                    onClick={() => setIsDetailOpen(true)}
                >
                    {item.covers?.[0] ? (
                        <img src={item.covers[0]} alt={item.name}/>
                    ) : (
                        <div className="item__catalog__media__placeholder"/>
                    )}
                    {item.promotion && (
                        <span className="item__catalog__badge">
                            -{item.promotion.discount_percent}%
                        </span>
                    )}
                </button>
            </div>
            <div className="item__catalog__body">
                <div className="item__catalog__name">{item.name}</div>
                <div className="item__catalog__info">
                    {sizes.length > 0 && (
                        <span>{sizes.map(s => s.size).join(', ')}</span>
                    )}
                </div>
                <div className="item__catalog__footer">
                    <div className="item__catalog__price">{convert(item.price)} {currency.symbol}</div>
                    <button className="btn btn__ghost" onClick={() => setIsDetailOpen(true)}>
                        Voir
                    </button>
                </div>
            </div>

            {isDetailOpen && (
                <div className="item__modal__overlay" onClick={() => setIsDetailOpen(false)}>
                    <div className="item__modal__content" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="item__modal__close" onClick={() => setIsDetailOpen(false)}>
                            Fermer
                        </button>

                        <div className="item__modal__media">
                            <ImageCarousel covers={item.covers ?? []} name={item.name}/>
                        </div>

                        <h2 className="item__modal__title">{item.name}</h2>
                        <p className="item__modal__price">{convert(item.price)} {currency.symbol}</p>

                        {sizes.length > 0 && (
                            <div className="item__modal__sizes">
                                {sizes.map(s => (
                                    <button
                                        key={s.size}
                                        type="button"
                                        className={`item__size__btn${selectedSize?.size === s.size ? ' item__size__btn--active' : ''}${s.stock === 0 ? ' item__size__btn--out' : ''}`}
                                        onClick={() => setSelectedSize(s)}
                                        disabled={s.stock === 0}
                                        title={s.stock === 0 ? 'Rupture de stock' : `Stock : ${s.stock}`}
                                    >
                                        {s.size}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="item__modal__actions">
                            <button
                                className="btn"
                                onClick={() => addToCart({...item, selectedSize: selectedSize?.size})}
                                disabled={outOfStock}
                            >
                                {outOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
}

export default Item;
