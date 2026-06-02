// Barre de progression affichée lors de chaque changement de page.
// Par défaut : animation rapide (~500ms). Si une page appelle setLoading(true)
// via LoadingContext, la barre rampe lentement jusqu'à ce que setLoading(false) soit appelé.
import {useContext, useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {LoadingContext} from '../context/loadingContext';

function ProgressBar() {
    const location = useLocation();
    const {loading} = useContext(LoadingContext);
    const [width, setWidth] = useState(0);
    const [visible, setVisible] = useState(false);

    const timers = useRef([]);
    // true dès qu'une page a appelé setLoading(true) pour ce trajet
    const controlledRef = useRef(false);
    // ref miroir de loading pour le lire à l'intérieur des timeouts
    const loadingRef = useRef(loading);

    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    function clear() {
        timers.current.forEach(clearTimeout);
        timers.current = [];
    }

    function finish() {
        controlledRef.current = false;
        clear();
        setWidth(100);
        timers.current.push(setTimeout(() => setVisible(false), 400));
    }

    // Démarre la barre à chaque changement de route
    useEffect(() => {
        clear();
        controlledRef.current = false;
        setVisible(true);
        setWidth(0);
        timers.current.push(setTimeout(() => setWidth(30), 30));

        // Laisse 120ms aux pages pour appeler setLoading(true) avant de décider
        timers.current.push(setTimeout(() => {
            if (!controlledRef.current) finish();
        }, 120));
    }, [location.pathname]);

    // Une page a pris le contrôle : annule l'auto-complétion
    useEffect(() => {
        if (!loading) return;
        controlledRef.current = true;
        clear();
        timers.current.push(setTimeout(() => setWidth(30), 30));
    }, [loading]);

    // Rampe lente pendant que la page charge
    useEffect(() => {
        if (!loading || !visible) return;
        const id = setInterval(() => setWidth(w => (w < 72 ? w + 2 : w)), 120);
        return () => clearInterval(id);
    }, [loading, visible]);

    // Complète quand le chargement contrôlé se termine
    useEffect(() => {
        if (loading) return;
        if (!controlledRef.current) return;
        finish();
    }, [loading]);

    if (!visible) return null;
    return (
        <div
            className="progress-bar"
            style={{width: `${width}%`, opacity: width === 100 ? 0 : 1}}
        />
    );
}

export default ProgressBar;
