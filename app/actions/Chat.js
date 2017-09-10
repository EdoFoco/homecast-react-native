import * as types from './Types';

export function message(data){
    return {
        type: types.SERVER_MESSAGE,
        data: data
    }
}

export function connect(data){
    return {
        type: types.SERVER_CONNECT,
        data: data
    }
}

export function joinRoom(data){
    return {
        type: types.SERVER_JOIN_ROOM,
        data: data
    }
}

export function disconnect(data){
    return {
        type: types.SERVER_DISCONNECT,
        data: data
    }
}

export function userIsTyping(data){
    return {
        type: types.SERVER_USER_IS_TYPING,
        data: data
    }
}

export function chatTextChanged(data){
    return {
        type: types.CHAT_MESSAGE_CHANGED,
        currentMessage: data.currentMessage,
        userIsTyping: data.userIsTyping
    }
}

export function setIsPresenter(isPresenter){
    return {
        type: types.SET_IS_PRESENTER,
        isPresenter: isPresenter
    }
}