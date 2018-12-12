import * as types from './Types';
import { AsyncStorage } from 'react-native';

export function getActionForError(error){
    if(!error.response && error.message.toLowerCase() == 'network error'){
        return showNetworkError(true);
    }
    if(error.response && error.response.status){
        switch(error.response.status){
            case 400:
                if(error.response.data.error === 'token_invalid' || error.response.data.error === 'token_not_provided'){
                    return handleUnauthorized();
                }
                
                return handleBadRequest(error.response.data.error.message);
            case 403:
            case 401:
                return handleUnauthorized();
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
