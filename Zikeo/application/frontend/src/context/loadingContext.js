// Contexte partagé pour signaler qu'une page est en cours de chargement
import {createContext, useContext, useState} from 'react';

export const LoadingContext = createContext({loading: false, setLoading: () => {}});

export function LoadingProvider({children}) {
    const [loading, setLoading] = useState(false);
    return (
        <LoadingContext.Provider value={{loading, setLoading}}>
            {children}
        </LoadingContext.Provider>
    );
}

export function usePageLoading() {
    return useContext(LoadingContext);
}
