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
import Profile from "./pages/Profile";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import AdminUsers from "./pages/AdminUsers";
import Promotions from "./pages/Promotions";

function ScrollToTop() {
    const {pathname} = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <LanguageProvider>
                <CurrencyProvider>
                    <OptionProvider>
                        <ScrollToTop/>
                        <PageWrapper>
                            <Switch>
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
                                <Route path="*">
                                    <Error/>
                                </Route>
                            </Switch>
                        </PageWrapper>
                    </OptionProvider>
                </CurrencyProvider>
            </LanguageProvider>
        </Router>
    </React.StrictMode>
);
