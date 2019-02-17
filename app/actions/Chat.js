import * as types from './Types';
import ApiServiceFactory from '../libs/services/ApiServiceFactory';
import * as ErrorHandler from './ErrorHandler';

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

export function getChats(page, senderNameQuery){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.getChats(page, senderNameQuery);
            dispatch(updateChats(resp.data));
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }   
      }
  }

export function createChat(participantIds){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.createChat(participantIds);
            dispatch(getChats());
            return resp.data;
        }
        catch(error){
            handleError(error, dispatch);
        }   
      }
  }

export function getMessages(chatId, page){
    console.log(page);
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

  export function sendMessage(chatId, message){
    return async (dispatch, getState) => {
        try{
            var apiService = await ApiServiceFactory.getInstance();
            var resp = await apiService.sendMessage(chatId, message);
            return {
                type: 'DO_NOTHING'
            };
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
        dispatch(action);
    }
    throw error;
}