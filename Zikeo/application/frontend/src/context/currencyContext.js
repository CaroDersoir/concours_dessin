import {useState, createContext, useEffect} from 'react';

export const CURRENCIES = [
    {code: 'EUR', symbol: '€',  label: 'Euro'},
    {code: 'USD', symbol: '$',  label: 'Dollar américain'},
    {code: 'GBP', symbol: '£',  label: 'Livre sterling'},
    {code: 'CHF', symbol: 'Fr.', label: 'Franc suisse'},
    {code: 'JPY', symbol: '¥',  label: 'Yen japonais'},
    {code: 'BRL', symbol: 'R$', label: 'Real brésilien'},
];

export const CurrencyContext = createContext();

export const CurrencyProvider = ({children}) => {
    const [currency, setCurrency] = useState(() => {
        const saved = localStorage.getItem('currency');
        return CURRENCIES.find(c => c.code === saved) || CURRENCIES[0];
    });

    useEffect(() => {
        localStorage.setItem('currency', currency.code);
    }, [currency]);

    return (
        <CurrencyContext.Provider value={{currency, setCurrency, currencies: CURRENCIES}}>
            {children}
        </CurrencyContext.Provider>
    );
};