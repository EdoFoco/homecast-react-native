import * as types from './Types';
import TntApi from '../libs/services/TntApi';
import { AsyncStorage } from 'react-native';

export function actionAuthenticating(){
    return {
        type: types.AUTHENTICATING,
        isAuthenticating: true
    }
}

export function actionNotAuthenticating(){
    return {
        type: types.AUTHENTICATING,
        isAuthenticating: false
    }
}

export function loginFailed(error){
    console.log(error);
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

async function _saveAuthToken(token){
    try {
        console.log('saving' + token);
        await AsyncStorage.setItem('@AuthToken:key', token);
    } catch (error) {
        console.log(error);
    }
}

export function loginUser(credentials) {
  return (dispatch, getState) => {
    const params = {
        "email": credentials.username,
        "password": credentials.password
    }

    dispatch(actionAuthenticating());

    return TntApi.post(`auth/login`, params)
        .then(resp => {
            _saveAuthToken(resp.token);
            dispatch(loginAction({user: resp}));
        }).catch( (ex) => {
            dispatch(loginFailed(ex));
        });
  }
}

export function getUser(token) {
  return (dispatch, getState) => {
    const params = {
        "email": "no12@test.com",
        "password": "test"
    }

    dispatch(actionAuthenticating());

    return TntApi.post(`auth/login`, params)
        .then(resp => {
            _saveAuthToken(resp.token);
            dispatch(loginAction({user: resp}));
        }).catch( (ex) => {
            dispatch(loginFailed(ex));
        });
  }
}

