import { AppState, LOGIN } from '../reduxStore';
import React, { useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { GoogleLogin } from 'react-google-login';
import _ from 'lodash';
import client from './client.json';
import { toast } from 'react-toastify';

interface Props extends RouteComponentProps {}

const Auth = () => {
    const [loggedIn, setLoggedIn] = useState(
        useSelector<AppState, AppState['signedIn']>((state) => state.signedIn)
    );
    const dispatch = useDispatch();

    const onSuccess = (response: any) => {
        const token = _.pick(response.tokenObj, ['access_token', 'expires_at']);
        toast.success(`User: ${response.profileObj.name} logged in`);
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
                    onFailure={() => toast.error('Login Failed!')}
                    cookiePolicy={'single_host_origin'}
                    scope="https://www.googleapis.com/auth/youtube"
                />
            )}
        </>
    );
};

export default Auth;
