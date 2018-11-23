import * as types from './Types';
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
    return async (dispatch) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.login(credentials);
            dispatch(updateUserInfo(resp.data.user));
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }
    }
}

export function signup(info){
    return async (dispatch) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.signup(info);
            dispatch(updateUserInfo(resp.data.user));
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }
    }
}

export function getLoggedInUser(){
    return async (dispatch) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.getLoggedInUser();
            dispatch(updateUserInfo(resp.data.user));
            return resp.data.user;
        }
        catch(error){
            handleError(error, dispatch);
        }
    }
}

export function updateDeviceToken($userId, $token){
    return async (dispatch) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            await apiService.updateDeviceToken($userId, $token);
            return dispatch(getLoggedInUser());
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