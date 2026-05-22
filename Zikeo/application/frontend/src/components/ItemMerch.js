import '../styles/ItemMerch.css';
import {useEffect, useState} from 'react';
import Item from "./Item";
import {getAllItems} from '../service/itemsServiceFront';


function ItemMerch({cart, updateCart}) {

    const [itemsList, setItemsList] = useState([])

    useEffect(() => {
        getAllItems()
            .then(setItemsList)
            .catch(error => console.error('Erreur lors de la récupération des vêtements :', error));
    }, []);

    const addToCart = (item) => {
        const existing = cart.find(i => i.name === item.name);

        if (existing) {
            updateCart(
                cart.map(i =>
                    i.name === item.name
                        ? {...i, amount: i.amount + 1}
                        : i
                )
            );
        } else {
            updateCart([...cart, {...item, amount: 1}]);
        }
    };

    return (
        <div className="catalog">
            <div className="catalog__header">
                <div>
                    <h2 className="catalog__title">Boutique</h2>
                    <p className="catalog__subtitle">Selection neon du moment</p>
                </div>
                <div className="catalog__meta">{itemsList.length} articles</div>
            </div>

            {/* Affichage de la liste des articles */}
            <ul className="catalog__grid">
                {itemsList.map((item) => (
                    <Item
                        id={item.id}
                        key={item.name}
                        item={item}
                        addToCart={addToCart}
                    />))}
            </ul>
        </div>
    )
}


export default ItemMerch
