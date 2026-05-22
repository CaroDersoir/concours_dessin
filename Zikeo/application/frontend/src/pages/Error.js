import Footer from "../components/Footer"
import Header from "../components/Header"

function Error() {
    return (
        <div className="page">
            <Header />
            <main className="page__content">
                <h1 className="page__title">Erreur 404</h1>
                <section className="page__section">
                    La page que vous recherchez n'existe pas.
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default Error
