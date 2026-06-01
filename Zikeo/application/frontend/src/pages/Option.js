import Header from '../components/Header';
import Footer from '../components/Footer';
import {useContext} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import {LanguageContext, LANGUAGES} from '../context/languageContext';
import {CurrencyContext} from '../context/currencyContext';
import '../styles/Option.css';
import {OptionContext} from "../context/indexContext";

const themes = [
    {id: 'ocean', label: 'Zikéolarge', hashtag: '#SouslOcean'},
    {id: 'maya', label: 'Zikéo', hashtag: '#MayalAbeille'},
    {id: 'eolienne', label: 'Zikéolienne', hashtag: '#EnRotationDansLeVent'},
    {id: 'oblique', label: 'Zikéoblique', hashtag: '#PencheDansLeSpectre'},
    {id: 'nuit', label: 'Zikéolit', hashtag: '#SousLaLune'},
    {id: 'automne', label: 'Zikéotomne', hashtag: '#FeuillesMortesEtMusique'},
    {id: 'rose', label: 'ZikéauDeRose', hashtag: '#LaVieEnRose'},
    {id: 'lumiere', label: 'Zikéolumière', hashtag: '#SousLesProjecteurs'},
];

function Option() {
    const {mode, setMode} = useContext(OptionContext);
    const {lang, setLang} = useContext(LanguageContext);
    const {currency, setCurrency, currencies} = useContext(CurrencyContext);
    const location = useLocation();
    const history = useHistory();
    const tab = new URLSearchParams(location.search).get('tab') || 'theme';
    const setTab = (newTab) => history.replace(`/option?tab=${newTab}`);

    return (
        <div className={`page ${mode}__mode`}>
            <Header/>

            <main className="page__content">
                <h1 className="page__title">Option</h1>

                <div className="option__tabs">
                    <button
                        className={`option__tab ${tab === 'theme' ? 'option__tab--active' : ''}`}
                        onClick={() => setTab('theme')}
                    >
                        Thème
                    </button>
                    <button
                        className={`option__tab ${tab === 'langue' ? 'option__tab--active' : ''}`}
                        onClick={() => setTab('langue')}
                    >
                        Langue
                    </button>
                    <button
                        className={`option__tab ${tab === 'devise' ? 'option__tab--active' : ''}`}
                        onClick={() => setTab('devise')}
                    >
                        Devise
                    </button>
                </div>

                {tab === 'theme' && (
                    <div className="option__options">
                        {themes.map((theme) => (
                            <label className="option__option" key={theme.id}>
                                <input
                                    type="radio"
                                    name="theme"
                                    value={theme.id}
                                    checked={mode === theme.id}
                                    onChange={() => setMode(theme.id)}
                                />
                                <span>{theme.label}</span>
                                <span className="option__badge">{theme.hashtag}</span>
                            </label>
                        ))}
                    </div>
                )}

                {tab === 'langue' && (
                    <div className="option__options">
                        {LANGUAGES.map((l) => (
                            <label className="option__option" key={l.code}>
                                <input
                                    type="radio"
                                    name="langue"
                                    value={l.code}
                                    checked={lang === l.code}
                                    onChange={() => setLang(l.code)}
                                />
                                <span>{l.flag} {l.label}</span>
                                <span className="option__badge">{l.code.toUpperCase()}</span>
                            </label>
                        ))}
                    </div>
                )}

                {tab === 'devise' && (
                    <div className="option__options">
                        {currencies.map((c) => (
                            <label className="option__option" key={c.code}>
                                <input
                                    type="radio"
                                    name="devise"
                                    value={c.code}
                                    checked={currency.code === c.code}
                                    onChange={() => setCurrency(c)}
                                />
                                <span>{c.symbol} — {c.label}</span>
                                <span className="option__badge">{c.code}</span>
                            </label>
                        ))}
                    </div>
                )}
            </main>

            <Footer/>
        </div>
    );
}

export default Option;