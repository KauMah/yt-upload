import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { AppState } from './reduxStore';
import Auth from './components/login';
import EditVideo from './components/editVideo';
import React from 'react';
import TileView from './components/tileView';
import { useSelector } from 'react-redux';

const App = () => {
    const loginState = useSelector<AppState, AppState['signedIn']>(
        (state) => state.signedIn
    );
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/videos" />
                </Route>
                <Route exact path="/videos">
                    {loginState ? <TileView /> : <Redirect to="/login" />}
                </Route>
                <Route path="/login" component={Auth} />
                <Route path="/videos/:id" component={EditVideo} />
                <Route
                    path="/"
                    render={() => <div>404, no dinosaurs here buddy</div>}
                />
            </Switch>
        </BrowserRouter>
    );
};

export default App;
