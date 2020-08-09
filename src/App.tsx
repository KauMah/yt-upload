import { AppState } from "./reduxStore";
import Auth from "./components/login";
import React from "react";
import { useSelector } from "react-redux";

const App = () => {
    const loginState = useSelector<AppState, AppState["signedIn"]>(
        (state) => state.signedIn
    );
    return <>{loginState ? "You are logged in" : <Auth />}</>;
};

export default App;
