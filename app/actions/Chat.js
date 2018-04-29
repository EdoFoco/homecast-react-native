import * as types from './Types';
import ApiServiceFactory from '../libs/services/ApiServiceFactory';

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

export function getRoomStatus(roomId){
    return {
        type: types.SERVER_ROOM_STATUS,
        roomId: roomId
    }
}

export function updateChats(chats){
    return {
        type: types.UPDATE_CHATS,
        chats: chats
    }
}

export function getChats(){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.getChats();
            dispatch(updateChats(resp.data));
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }   
      }
  }

export function getMessages(chatId, page){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.getMessages(chatId, page);
            dispatch({
                type: 'DO_NOTHING'
            });
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }   
      }
  }
