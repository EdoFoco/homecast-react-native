import * as types from './Types';
import TntApi from '../libs/services/TntApi';

export function loginUser(credentials) {
  return (dispatch, getState) => {
    const params = {
        "email": credentials.username,
        "password": credentials.password
    }

    dispatch(isAuthenticating());

    return TntApi.post(`auth/login`, params)
        .then(resp => {
            dispatch(loginAction({user: resp}));
        }).catch( (ex) => {
            dispatch(loginFailed(ex));
        });
  }
}

export function isAuthenticating(){
    return {
        type: types.AUTHENTICATING,
        isAuthenticating: true
    }
}

export function loginFailed(error){
    return {
        type: types.LOGIN_FAILED,
        isLoggedIn: false,
        isAuthenticating: false,
        user: {},
        error: error
    }
}

export function loginAction(userData) {
    return {
        type: types.LOGIN,
        isLoggedIn: true,
        isAuthenticating: false,
        user: userData.user,
        error: null
    }
}

export function actionLogout() {
    console.log('Dispatched Logout');

    return {
        type: types.LOGOUT,
        isLoggedIn: false,
        isAuthenticating: false,
        user: {}
    }
}