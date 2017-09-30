import * as types from './Types';


export function handleUnauthorized(){
    return {
        type: types.UNAUTHORIZED_USER,
        data: null
    }
}
