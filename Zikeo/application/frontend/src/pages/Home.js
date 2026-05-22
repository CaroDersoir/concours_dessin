import Header from '../components/Header';
import Footer from '../components/Footer';
function Home() {
    return (
        <div className="page">
            <Header />
            <main className="page__content">
                <h1 className="page__title">Home</h1>
                <section className="page__section">
                    Bienvenue sur Zikeo.
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default Home;
