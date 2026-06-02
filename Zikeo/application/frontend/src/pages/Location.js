import Header from '../components/Header';
import Footer from '../components/Footer';
import {useContext} from 'react';
import {LanguageContext} from '../context/languageContext';

function Location() {
    const {t} = useContext(LanguageContext);
    return (
        <div className="page">
            <Header />
            <main className="page__content">
                <h1 className="page__title">{t('location_title')}</h1>
                <section className="page__section">
                    {t('location_soon')}
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default Location;
