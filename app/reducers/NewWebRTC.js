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
      roomId: 'test1'
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
  
    default:
      return state;
  }
}
