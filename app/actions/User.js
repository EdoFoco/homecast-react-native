import * as types from './Types';
import ApiService from '../libs/services/ApiService';
import { AsyncStorage } from 'react-native';

export function updateUserInfo(user){
    return {
        type: types.UPDATE_USER_INFO,
        user: user
    }
}

export function updateAuthToken(token, isNew){
    if(isNew){
        AsyncStorage.setItem('@AuthToken:key', token);
    }

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
                let user = resp.data.user;
                dispatch(updateUserInfo(user))
                return resp.data.token;
            })
            .then((token) => {
                dispatch(updateAuthToken(token, true));
            });
    }
}

export function getLoggedInUser(){
    return (dispatch, getState) => {
        return ApiService.getLoggedInUser()
            .then((resp) => {
                dispatch(updateUserInfo(resp.data));
            });
    }
}