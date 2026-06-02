import {createContext, useEffect, useState} from 'react';

export const CURRENCIES = [
    {code: 'EUR', symbol: '€', label: 'Euro', rate: 1},
    {code: 'USD', symbol: '$', label: 'Dollar américain', rate: 1.08},
    {code: 'GBP', symbol: '£', label: 'Livre sterling', rate: 0.86},
    {code: 'CHF', symbol: 'Fr.', label: 'Franc suisse', rate: 0.97},
    {code: 'JPY', symbol: '¥', label: 'Yen japonais', rate: 164},
    {code: 'BRL', symbol: 'R$', label: 'Real brésilien', rate: 5.40},
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

    const convert = (priceEur) => (Number(priceEur) * currency.rate).toFixed(2);

    return (
        <CurrencyContext.Provider value={{currency, setCurrency, currencies: CURRENCIES, convert}}>
            {children}
        </CurrencyContext.Provider>
    );
};
