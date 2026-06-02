import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import Merch from './pages/Merch';
import Detail from './pages/Detail';
import Error from './pages/Error';
import Option from './pages/Option';
import Partitions from './pages/Partitions';
import Planning from './pages/Planning';
import Location from './pages/Location';
import Formations from './pages/Formations';
import Home from './pages/Home';
import MerchAdmin from './pages/MerchAdmin';
import Login from './pages/Login';
import {OptionProvider} from './context/indexContext';
import {LanguageProvider} from './context/languageContext';
import {CurrencyProvider} from './context/currencyContext';
import {BrowserRouter as Router, Route, Switch, useLocation} from 'react-router-dom';
import PageWrapper from './pages/PageWrapper';
import PageErrorBoundary from './components/PageErrorBoundary';
import ProgressBar from './components/ProgressBar';
import {LoadingProvider} from './context/loadingContext';
import Profile from "./pages/Profile";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import AdminUsers from "./pages/AdminUsers";
import AdminNotifications from "./pages/AdminNotifications";
import AdminCommandes from "./pages/AdminCommandes";
import Promotions from "./pages/Promotions";
import Litiges from "./pages/Litiges";
import FormationsAdmin from "./pages/FormationsAdmin";
import HomeAdmin from "./pages/HomeAdmin";
import Checkout from "./pages/Checkout";

function ScrollToTop() {
    const {pathname} = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

// Remet l'ErrorBoundary à zéro à chaque changement de route pour isoler les crashs par page
function SafeSwitch({children}) {
    const {pathname} = useLocation();
    return (
        <PageErrorBoundary key={pathname}>
            <Switch>{children}</Switch>
        </PageErrorBoundary>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <LoadingProvider>
            <LanguageProvider>
                <CurrencyProvider>
                    <OptionProvider>
                        <ScrollToTop/>
                        <ProgressBar/>
                        <PageWrapper>
                            <SafeSwitch>
                                <Route exact path="/">
                                    <Home/>
                                </Route>
                                <Route path="/merch">
                                    <Merch/>
                                </Route>
                                <Route path="/gestion-merch">
                                    <MerchAdmin/>
                                </Route>
                                <Route path="/detail/:idArticle">
                                    <Detail/>
                                </Route>
                                <Route path="/partitions">
                                    <Partitions/>
                                </Route>
                                <Route path="/planning">
                                    <Planning/>
                                </Route>
                                <Route path="/location">
                                    <Location/>
                                </Route>
                                <Route path="/formations">
                                    <Formations/>
                                </Route>
                                <Route path="/option">
                                    <Option/>
                                </Route>
                                <Route path="/login">
                                    <Login/>
                                </Route>
                                <Route path="/profile">
                                    <Profile/>
                                </Route>
                                <Route path="/verify-email">
                                    <EmailVerificationPage/>
                                </Route>
                                <Route path="/admin/users">
                                    <AdminUsers/>
                                </Route>
                                <Route path="/promotions">
                                    <Promotions/>
                                </Route>
                                <Route path="/litiges">
                                    <Litiges/>
                                </Route>
                                <Route path="/gestion-formations">
                                    <FormationsAdmin/>
                                </Route>
                                <Route path="/admin/home">
                                    <HomeAdmin/>
                                </Route>
                                <Route path="/admin/notifications">
                                    <AdminNotifications/>
                                </Route>
                                <Route path="/admin/commandes">
                                    <AdminCommandes/>
                                </Route>
                                <Route path="/checkout">
                                    <Checkout/>
                                </Route>
                                <Route path="*">
                                    <Error/>
                                </Route>
                            </SafeSwitch>
                        </PageWrapper>
                    </OptionProvider>
                </CurrencyProvider>
            </LanguageProvider>
            </LoadingProvider>
        </Router>
    </React.StrictMode>
);
