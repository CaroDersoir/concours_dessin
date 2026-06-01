// Page de vérification d'email après inscription
import Header from '../components/Header';
import Footer from '../components/Footer';
import EmailVerification from '../components/EmailVerification';

function EmailVerificationPage() {
    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <EmailVerification/>
            </main>
            <Footer/>
        </div>
    );
}

export default EmailVerificationPage;
