import {useState, createContext, useEffect} from "react";

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {

    const [mode, setMode] = useState(() => {
        return localStorage.getItem('theme') || 'ocean'; // valeur par défaut
    });

    // sauvegarde automatique à chaque changement
    useEffect(() => {
        localStorage.setItem('theme', mode);
    }, [mode]);

    return (
        <PreferencesContext.Provider value={{ mode, setMode }}>
            {children}
        </PreferencesContext.Provider>
    )
}