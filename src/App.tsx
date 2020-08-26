import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { AppState } from './reduxStore';
import Auth from './components/login';
import EditVideo from './components/editVideo';
import React from 'react';
import TileView from './components/tileView';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

const App = () => {
    const loginState = useSelector<AppState, AppState['signedIn']>(
        (state) => state.signedIn
    );
    return (
        <>
            <ToastContainer />
            <BrowserRouter basename={`${process.env.PUBLIC_URL}/`}>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/videos" />
                    </Route>
                    <Route exact path="/videos">
                        {loginState ? <TileView /> : <Redirect to="/login" />}
                    </Route>
                    <Route path="/login" component={Auth} />
                    <Route exact path="/videos/create" component={EditVideo} />
                    <Route path="/videos/:id" component={EditVideo} />
                    <Route
                        path="/"
                        render={() => <div>404, how did you break this?</div>}
                    />
                </Switch>
            </BrowserRouter>
        </>
    );
};

export default App;
