import { createStore } from 'redux';
import { loadState } from './localStore';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export interface Login {
    type: typeof LOGIN;
    token: TokenObj;
}

export interface Logout {
    type: typeof LOGOUT;
}

export type Action = Login | Logout;

export interface TokenObj {
    access_token: string;
    expires_at: number;
}

export interface AppState {
    signedIn: boolean;
    accessToken: TokenObj;
}

const initialState: AppState = {
    signedIn: false,
    accessToken: {
        access_token: '',
        expires_at: 0,
    },
};

function reducer(state: AppState = initialState, action: Action) {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                signedIn: true,
                accessToken: action.token,
            };
        case LOGOUT:
            return {
                ...state,
                signedIn: false,
                accessToken: {
                    access_token: '',
                    expires_at: 0,
                },
            };
        default:
            return state;
    }
}

export const store = createStore(reducer, loadState());
