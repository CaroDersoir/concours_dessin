import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginDetail from '../components/LoginDetail';

function Login() {
    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <LoginDetail/>
            </main>
            <Footer/>
        </div>
    );
}

export default Login;
