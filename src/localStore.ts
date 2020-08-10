import { AppState } from './reduxStore';
export const saveState = (state: AppState) => {
    try {
        const stateString = JSON.stringify(state);
        localStorage.setItem('state', stateString);
    } catch (e) {
        console.log(e);
    }
};

export const loadState = () => {
    try {
        const stateString = localStorage.getItem('state');
        if (!stateString) {
            return undefined;
        }
        return JSON.parse(stateString);
    } catch (e) {
        return undefined;
    }
};
