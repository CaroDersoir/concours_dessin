import {createContext, useEffect, useState} from "react";

export const OptionContext = createContext();

export const OptionProvider = ({children}) => {

    const [mode, setMode] = useState(() => {
        return localStorage.getItem('theme') || 'ocean'; // valeur par défaut
    });

    // sauvegarde automatique à chaque changement
    useEffect(() => {
        localStorage.setItem('theme', mode);
    }, [mode]);

    return (
        <OptionContext.Provider value={{mode, setMode}}>
            {children}
        </OptionContext.Provider>
    )
}