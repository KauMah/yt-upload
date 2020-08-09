import { GoogleLogin } from 'react-google-login';
import { LOGIN } from '../reduxStore';
import React from 'react';
import _ from 'lodash';
import client from './client.json';
import { useDispatch } from 'react-redux';

const Auth = () => {
    const dispatch = useDispatch();
    const onSuccess = (response: any) => {
        const token = _.get(response, 'accessToken', '');
        if (token !== '') {
            dispatch({ type: LOGIN, token: token });
        } else {
            window.alert('Something went wrong');
        }
    };
    return (
        <GoogleLogin
            clientId={client.web.client_id}
            buttonText="Login"
            onSuccess={onSuccess}
            onFailure={() => console.log('I no work')}
            cookiePolicy={'single_host_origin'}></GoogleLogin>
    );
};

export default Auth;
