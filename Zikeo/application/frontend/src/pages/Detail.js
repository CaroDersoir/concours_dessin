import Header from "../components/Header";
import ItemDetail from "../components/ItemDetail";
import Footer from "../components/Footer";

function Detail() {
    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <ItemDetail/>
            </main>
            <Footer/>
        </div>
    )
}

export default Detail
