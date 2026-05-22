import Header from '../components/Header';
import Footer from '../components/Footer';
function Formations() {
    return (
        <div className="page">
            <Header />
            <main className="page__content">
                <h1 className="page__title">Formations</h1>
                <section className="page__section">
                    Catalogue des formations a venir.
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default Formations;
