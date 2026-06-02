import Header from '../components/Header';
import Footer from '../components/Footer';
import {useContext} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import {LanguageContext, LANGUAGES} from '../context/languageContext';
import {CurrencyContext} from '../context/currencyContext';
import '../styles/Option.css';
import {OptionContext} from "../context/indexContext";

const themes = [
    {id: 'ocean',     labelKey: 'option_theme_ocean_label',    tagKey: 'option_theme_ocean_tag'},
    {id: 'maya',      labelKey: 'option_theme_maya_label',     tagKey: 'option_theme_maya_tag'},
    {id: 'eolienne',  labelKey: 'option_theme_eolienne_label', tagKey: 'option_theme_eolienne_tag'},
    {id: 'oblique',   labelKey: 'option_theme_oblique_label',  tagKey: 'option_theme_oblique_tag'},
    {id: 'nuit',      labelKey: 'option_theme_nuit_label',     tagKey: 'option_theme_nuit_tag'},
    {id: 'automne',   labelKey: 'option_theme_automne_label',  tagKey: 'option_theme_automne_tag'},
    {id: 'rose',      labelKey: 'option_theme_rose_label',     tagKey: 'option_theme_rose_tag'},
    {id: 'lumiere',   labelKey: 'option_theme_lumiere_label',  tagKey: 'option_theme_lumiere_tag'},
];

function Option() {
    const {mode, setMode} = useContext(OptionContext);
    const {lang, setLang, t} = useContext(LanguageContext);
    const {currency, setCurrency, currencies} = useContext(CurrencyContext);
    const location = useLocation();
    const history = useHistory();
    const tab = new URLSearchParams(location.search).get('tab') || 'theme';
    const setTab = (newTab) => history.replace(`/option?tab=${newTab}`);

    return (
        <div className={`page ${mode}__mode`}>
            <Header/>

            <main className="page__content">
                <h1 className="page__title">{t('option_title')}</h1>

                <div className="option__tabs">
                    <button
                        className={`option__tab ${tab === 'theme' ? 'option__tab--active' : ''}`}
                        onClick={() => setTab('theme')}
                    >
                        {t('option_tab_theme')}
                    </button>
                    <button
                        className={`option__tab ${tab === 'langue' ? 'option__tab--active' : ''}`}
                        onClick={() => setTab('langue')}
                    >
                        {t('option_tab_langue')}
                    </button>
                    <button
                        className={`option__tab ${tab === 'devise' ? 'option__tab--active' : ''}`}
                        onClick={() => setTab('devise')}
                    >
                        {t('option_tab_devise')}
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
                                <span>{t(theme.labelKey)}</span>
                                <span className="option__badge">{t(theme.tagKey)}</span>
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
