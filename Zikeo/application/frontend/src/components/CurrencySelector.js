import {useContext} from 'react';
import {CurrencyContext} from '../context/currencyContext';
import '../styles/CurrencySelector.css';

function CurrencySelector() {
    const {currency, setCurrency, currencies} = useContext(CurrencyContext);

    const handleChange = (e) => {
        const selected = currencies.find(c => c.code === e.target.value);
        if (selected) setCurrency(selected);
    };

    return (
        <div className="currency-selector">
            <span className="currency-selector__symbol">{currency.symbol}</span>
            <select
                className="currency-selector__select"
                value={currency.code}
                onChange={handleChange}
                aria-label="Devise"
            >
                {currencies.map(c => (
                    <option key={c.code} value={c.code}>
                        {c.symbol} {c.code}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default CurrencySelector;