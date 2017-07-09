import * as types from '../actions/Types';

const initialConferenceState = { 
      info: 'Initializing',
      status: 'init',
      isFront: false,
      selfViewSrc: null,
      remoteList: {},
      textRoomConnected: false,
      textRoomData: [],
      textRoomValue: '',

      chatMessages: [],
      currentMessage: '',
      userIsTyping: false,
      usersTyping: [],
      roomId: 'test1',
      isPresenter: false,
      socketId: '',
      subscribedUsers: [],
      hasError: false,
      error: null
};

export default function webrtc(state = initialConferenceState, action) {
  switch(action.type){
    case types.CLIENT_MESSAGE:
      let newMessages = state.chatMessages;
      newMessages.push(action.data);
      return { ...state,  chatMessages: newMessages };
    case types.CHAT_MESSAGE_CHANGED:
        return { ...state,  userIsTyping: action.userIsTyping, currentMessage: action.currentMessage };
    case types.CLIENT_UPDATE_TYPING_USERS:
        return { ...state,  usersTyping: action.data.usersTyping };
    case types.CLIENT_USERS_UPDATED:
        return { ...state,  subscribedUsers: action.data.subscribedUsers };
    case types.CLIENT_CONNECTED:
        return { ...state,  socketId: action.data.socketId };
    case types.SET_IS_PRESENTER:
        return { ...state,  isPresenter: action.isPresenter };
    case types.SET_SOCKET_ERROR:
        return { ...state,  hasError: action.data.hasError, error: action.data.error };
    default:
      return state;
  }
}
