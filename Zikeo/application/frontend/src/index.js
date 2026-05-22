import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import Merch from './pages/Merch';
import Detail from './pages/Detail';
import Error from './pages/Error';
import Preferences from './pages/Preferences';
import Partitions from './pages/Partitions';
import Planning from './pages/Planning';
import Location from './pages/Location';
import Formations from './pages/Formations';
import Home from './pages/Home';
import MerchAdmin from './pages/MerchAdmin';
import {PreferencesProvider} from './context/indexContext';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PageWrapper from './pages/PageWrapper';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <PreferencesProvider>
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
                        <Route path="/preferences">
                            <Preferences/>
                        </Route>
                        <Route path="*">
                            <Error/>
                        </Route>
                    </Switch>
                </PageWrapper>
            </PreferencesProvider>
        </Router>
    </React.StrictMode>
);
