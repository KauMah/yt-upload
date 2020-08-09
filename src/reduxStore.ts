import { createStore } from "redux";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export interface Login {
    type: typeof LOGIN;
    token: string;
}

export interface Logout {
    type: typeof LOGOUT;
}

export type Action = Login | Logout;

export interface AppState {
    signedIn: boolean;
    accessToken: string;
}

const initialState: AppState = {
    signedIn: false,
    accessToken: "",
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
                accessToken: "",
            };
        default:
            return state;
    }
}

export const store = createStore(reducer);
