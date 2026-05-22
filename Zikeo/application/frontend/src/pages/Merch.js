import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';

function Merch() {
    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <h1 className="page__title">Merch</h1>
                <Content/>
            </main>
            <Footer/>
        </div>
    )
}

export default Merch;
