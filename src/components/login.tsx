import { AppState, LOGIN } from '../reduxStore';
import React, { useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { GoogleLogin } from 'react-google-login';
import _ from 'lodash';
import { toast } from 'react-toastify';

interface Props extends RouteComponentProps {}

const styles = {
    logo: {
        height: '200px',
        width: '300px',
    },
    centered: {
        textAlign: 'center' as 'center',
    },
};

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
    const client = process.env.REACT_APP_CLIENT_ID;
    return (
        <>
            {loggedIn ? (
                <Redirect to="/videos" />
            ) : (
                <div className="container" style={styles.centered}>
                    <img
                        style={styles.logo}
                        src="https://download.logo.wine/logo/YouTube/YouTube-Logo.wine.png"
                        alt="YouTube"
                        className="col-12"
                    />
                    <p>
                        Welcome to my YouTube upload client, where you can
                        upload and manage your content!
                    </p>
                    <div className="col-12">
                        <GoogleLogin
                            clientId={client as string}
                            buttonText="Login"
                            onSuccess={onSuccess}
                            onFailure={(err) => {
                                toast.error('Login Failed!');
                                console.log(err);
                            }}
                            cookiePolicy={'single_host_origin'}
                            scope="https://www.googleapis.com/auth/youtube"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Auth;
