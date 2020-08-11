import { AppState, LOGIN } from '../reduxStore';
import React, { useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { GoogleLogin } from 'react-google-login';
import _ from 'lodash';
import client from './client.json';

interface Props extends RouteComponentProps {}

const Auth = () => {
    const [loggedIn, setLoggedIn] = useState(
        useSelector<AppState, AppState['signedIn']>((state) => state.signedIn)
    );
    const dispatch = useDispatch();

    const onSuccess = (response: any) => {
        console.log(response);
        const token = _.pick(response.tokenObj, ['access_token', 'expires_at']);
        if (token.access_token) {
            dispatch({ type: LOGIN, token: token });
            setLoggedIn(true);
        }
    };
    return (
        <>
            {loggedIn ? (
                <Redirect to="/videos" />
            ) : (
                <GoogleLogin
                    clientId={client.web.client_id}
                    buttonText="Login"
                    onSuccess={onSuccess}
                    onFailure={() => window.alert('Login Failed!')}
                    cookiePolicy={'single_host_origin'}
                />
            )}
        </>
    );
};

export default Auth;
