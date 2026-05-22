import {useEffect, useState} from 'react';
import '../styles/Item.css';

function Item({item, addToCart}) {
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        if (!isDetailOpen) return;

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsDetailOpen(false);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isDetailOpen]);

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
                </button>
                {item.onSale && <span className="item__catalog__badge">Promo</span>}
            </div>
            <div className="item__catalog__body">
                <div className="item__catalog__name">{item.name}</div>
                <div className="item__catalog__info">
                    {item.size && <span>Taille {item.size}</span>}
                    <span>Comfort {item.comfort}</span>
                </div>
                <div className="item__catalog__footer">
                    <div className="item__catalog__price">{item.price} €</div>
                    <button className="btn btn__ghost" onClick={() => addToCart(item)}>
                        Ajouter
                    </button>
                </div>
            </div>

            {isDetailOpen && (
                <div className="item__modal__overlay" onClick={() => setIsDetailOpen(false)}>
                    <div className="item__modal__content" onClick={(event) => event.stopPropagation()}>
                        <button
                            type="button"
                            className="item__modal__close"
                            onClick={() => setIsDetailOpen(false)}
                        >
                            Fermer
                        </button>

                        <div className="item__modal__media">
                            {item.covers?.length > 0 ? (
                                item.covers.map((url, index) => (
                                    <img key={index} src={url} alt={`${item.name} ${index + 1}`}/>
                                ))
                            ) : (
                                <div className="item__catalog__media__placeholder"/>
                            )}
                        </div>

                        <h2 className="item__modal__title">{item.name}</h2>
                        <p className="item__modal__description">
                            {item.description || `Piece ${item.category || 'streetwear'} au style neon, confortable et prete pour la scene.`}
                        </p>
                        <p>Prix : {item.price} euros</p>
                        {item.size && <p>Taille : {item.size}</p>}
                        {item.comfort && <p>Confort : {item.comfort}</p>}

                        <div className="item__modal__actions">
                            <button
                                className="btn"
                                onClick={() => addToCart(item)}
                            >
                                Ajouter au panier
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
}

export default Item;
