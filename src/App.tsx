import { AppState } from './reduxStore';
import Auth from './components/login';
import React from 'react';
import TileView from './components/tileView';
import { useSelector } from 'react-redux';

const App = () => {
    const loginState = useSelector<AppState, AppState['signedIn']>(
        (state) => state.signedIn
    );
    return <>{loginState ? <TileView /> : <Auth />}</>;
};

export default App;
