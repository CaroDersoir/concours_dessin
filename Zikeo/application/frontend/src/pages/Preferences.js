import Header from '../components/Header';
import Footer from '../components/Footer';
import {useContext} from 'react';
import {PreferencesContext} from '../context/indexContext';
import '../styles/Preferences.css';

const themes = [
    {id: "ocean", label: "Zikéolarge", hashtag: "#SouslOcean"},
    {id: "maya", label: "zzzzzzzzzzzzzzzzzzzzzzzzikeo", hashtag: "#MayalAbeille"},
    {id: "eolienne", label: "Zikéolienne", hashtag: "#EnRotationDansLeVent"},
    {id: "oblique", label: "Zikéoblique", hashtag: "#PencheDansLeSpectre"},
    {id: "nuit", label: "Zikéolit", hashtag: "#SousLaLune"},
    {id: "automne", label: "Zikéotomne", hashtag: "#FeuillesMortesEtMusique"},
    {id: "rose", label: "ZikéauDeRose", hashtag: "#LaVieEnRose"},
];

function Preferences() {
    const {mode, setMode} = useContext(PreferencesContext);

    return (
        <div className={`page ${mode}__mode`}>
            <Header/>

            <main className="page__content">
                <h1 className="page__title">Préférences</h1>

                <div className="preferences__options">
                    {themes.map((theme) => (
                        <label className="preferences__option" key={theme.id}>
                            <input
                                type="radio"
                                name="theme"
                                value={theme.id}
                                checked={mode === theme.id}
                                onChange={() => setMode(theme.id)}
                            />
                            <span>{theme.label}</span>
                            <span className="preferences__badge">{theme.hashtag}</span>
                        </label>
                    ))}
                </div>
            </main>

            <Footer/>

        </div>
    )
}

export default Preferences;
