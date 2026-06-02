import Footer from "../components/Footer"
import Header from "../components/Header"
import {useContext} from 'react';
import {LanguageContext} from '../context/languageContext';

function Error() {
    const {t} = useContext(LanguageContext);
    return (
        <div className="page">
            <Header />
            <main className="page__content">
                <h1 className="page__title">{t('error_title')}</h1>
                <section className="page__section">
                    {t('error_message')}
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default Error
