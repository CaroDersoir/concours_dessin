import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import {useContext} from 'react';
import {LanguageContext} from '../context/languageContext';

function Merch() {
    const {t} = useContext(LanguageContext);
    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <h1 className="page__title">{t('item_merch_title')}</h1>
                <Content/>
            </main>
            <Footer/>
        </div>
    )
}

export default Merch;
