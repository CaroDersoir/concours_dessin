import '../styles/Cart.css';

function Cart({cart, updateCart}) {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].amount;
    }


    return (
        <div className='basket'>
            <div className="basket__header">
                <h2 className="basket__title">Panier</h2>
                <span className="basket__count">{cart.length} items</span>
            </div>

            <ul className="basket__list">
                {cart.length === 0 && (
                    <li className="basket__empty">Votre panier est vide.</li>
                )}
                {cart.map(item => (
                    <li className="basket__item" key={item.name}>
                        <div className="basket__name">{item.name}</div>
                        <div className="basket__line">{item.price} € x {item.amount}</div>
                    </li>
                ))}
            </ul>
            <div className="basket__total">
                Total : {total} €
            </div>
            <button className="btn basket__cta" onClick={() => updateCart([])}>
                Vider le panier
            </button>
        </div>
    );
}


export default Cart
