import {useState, createContext, useEffect} from 'react';
import fr from '../locales/fr.json';
import en from '../locales/en.json';
import pt from '../locales/pt.json';

const locales = {fr, en, pt};

export const LANGUAGES = [
    {code: 'fr', label: 'Français', flag: '🇫🇷'},
    {code: 'en', label: 'English',  flag: '🇬🇧'},
    {code: 'pt', label: 'Português', flag: '🇵🇹'},
];

export const LanguageContext = createContext();

export const LanguageProvider = ({children}) => {
    const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'fr');

    useEffect(() => {
        localStorage.setItem('lang', lang);
    }, [lang]);

    const t = (key, params) => {
        let str = locales[lang]?.[key] ?? key;
        if (params) {
            str = str.replace(/\{\{(\w+)\}\}/g, (_, k) => params[k] ?? '');
        }
        return str;
    };

    return (
        <LanguageContext.Provider value={{lang, setLang, t}}>
            {children}
        </LanguageContext.Provider>
    );
};