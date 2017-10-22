import * as types from './Types';
import ApiService from '../libs/services/ApiService';
import { AsyncStorage } from 'react-native';

export function updateUserInfo(user){
    return {
        type: types.UPDATE_USER_INFO,
        user: user
    }
}

export function updateAuthToken(token){
    AsyncStorage.setItem('@AuthToken:key', token);
    ApiService.setAuthToken(token);

    return {
        type: types.UPDATE_AUTH_TOKEN,
        token: token
    }
}

export function login(credentials){
    return (dispatch, getState) => {
        return ApiService.login(credentials)
            .then((resp) => {
                return resp.data;
            });
    }
}

export function logout(){
    return {
        type: types.LOGOUT,
        data: null
    }
}

export function getLoggedInUser(){
    return (dispatch, getState) => {
        return ApiService.getLoggedInUser()
            .then((resp) => {
                dispatch(updateUserInfo(resp.data.user));
            });
    }
}