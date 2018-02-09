import * as types from './Types';
import TntApi from '../libs/services/TntApi';

export function updateRoomId(roomId){
    return {
        type: types.UPDATE_ROOM_ID,
        roomId: roomId
    }
}

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

export function errorFethingViewing(error){
    console.log(error);
    //Todo: Do something
}

export function getViewing(viewingId){
    return (dispatch, getState) => {
        
        return TntApi.get('viewings/' + viewingId)
            .then(resp => {
                console.log(resp);
                dispatch(updateRoomId(resp.room.unique_id));
            }).catch( (ex) => {
                dispatch(errorFethingViewing(ex));
            });
      }
}

export function getRoomStatus(roomId){
    return {
        type: types.SERVER_ROOM_STATUS,
        roomId: roomId
    }
}

