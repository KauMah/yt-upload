import { GoogleLogin } from 'react-google-login';
import { LOGIN } from '../reduxStore';
import React from 'react';
import _ from 'lodash';
import client from './client.json';
import { useDispatch } from 'react-redux';

const Auth = () => {
    const dispatch = useDispatch();
    const onSuccess = (response: any) => {
        console.log(response);
        const token = _.pick(response.tokenObj, ['access_token', 'expires_at']);
        if (token.access_token) {
            dispatch({ type: LOGIN, token: token });
        }
    };
    return (
        <GoogleLogin
            clientId={client.web.client_id}
            buttonText="Login"
            onSuccess={onSuccess}
            onFailure={() => window.alert('Login Failed!')}
            cookiePolicy={'single_host_origin'}></GoogleLogin>
    );
};

export default Auth;
