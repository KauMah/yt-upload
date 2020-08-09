import {
    GoogleLogin,
    GoogleLoginResponse,
    GoogleLoginResponseOffline,
} from "react-google-login";

import { LOGIN } from "../reduxStore";
import React from "react";
import _ from "lodash";
import client from "./client.json";
import { useDispatch } from "react-redux";

const Auth = () => {
    const dispatch = useDispatch();
    const loginSuccess = (
        response: GoogleLoginResponse | GoogleLoginResponseOffline
    ) => {
        const token = _.get(response, "accessToken", "");
        if (token !== "") {
            dispatch({ type: LOGIN, token: token });
            console.log(`${LOGIN} is the enum, ${token} is the token`);
        } else {
            window.alert("Something went wrong");
        }
    };
    return (
        <GoogleLogin
            clientId={client.web.client_id}
            buttonText="Login"
            onSuccess={loginSuccess}
            onFailure={(response) => console.log(response)}
            cookiePolicy={"single_host_origin"}
        />
    );
};

export default Auth;
