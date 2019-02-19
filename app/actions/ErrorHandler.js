import * as types from './Types';
import { AsyncStorage } from 'react-native';

export function getActionForError(error){
    if(!error.response && error.message.toLowerCase() == 'network error'){
        //return showNetworkError(true);
        return handleNetworkError();
    }
    if(error.response && error.response.status){
        if(error.response.status == 401 || error.response.status == 403){
            return handleUnauthorized();
        }
        else if(error.response.status >= 400 && error.response.status < 500){
            if(error.response.data.error === 'token_invalid' || error.response.data.error === 'token_not_provided'){
                return handleUnauthorized();
            }

            return handleBadRequest();
        }
        else{
            return handleUnknown();
        }
    }
}

export function handleUnauthorized(){
    AsyncStorage.removeItem('@AuthToken:key');

    return {
        type: types.UNAUTHORIZED_USER,
        data: null
    }
}

export function showNetworkError(hasError){
    return {
        type: types.NETWORK_ERROR,
        hasError: hasError
    }
}

export function resetReducers(){
    return {
        type: types.RESET_REDUCERS
    }
}

export function handleBadRequest(message){
    throw { statusCode: 400, message: message };
}

export function handleNetworkError(message){
    throw { message: 'Sorry, something went wrong.' }
};

export function handleUnknown(){
    throw { statusCode: 500, message: 'Our engineers are on it. Try again later.'}
}
