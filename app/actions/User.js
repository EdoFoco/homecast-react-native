import * as types from './Types';
import { AsyncStorage } from 'react-native';
import * as ErrorHandler from './ErrorHandler';
import ApiServiceFactory from '../libs/services/ApiServiceFactory';

export function updateUserInfo(user){
    return {
        type: types.UPDATE_USER_INFO,
        user: user
    }
}

export function updateAuthenticatingState(isAuthenticating){
    return {
        type: types.AUTHENTICATING,
        isAuthenticating: isAuthenticating
    }
}

export function updateAuthToken(token){
    
    return {
        type: types.UPDATE_AUTH_TOKEN,
        token: token
    }
}

export function logout(){
    return {
        type: types.LOGOUT,
        data: null
    }
}


export function login(credentials){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.login(credentials);
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }
    }
}


export function getLoggedInUser(){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.getLoggedInUser()
            dispatch(updateUserInfo(resp.data.user));
            return resp.data.user;
        }
        catch(error){
            handleError(error, dispatch);
        }
    }
}

function handleError(error, dispatch){
    console.warn(error);
    var action = ErrorHandler.getActionForError(error);
    if(action){
        return dispatch(action);
    }
    throw error;
}