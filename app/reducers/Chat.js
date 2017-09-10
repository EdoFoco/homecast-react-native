 import * as types from '../actions/Types';
 
 const initalChatState = {
      socketId: '',
      subscribedUsers: [],
      chatMessages: [],
      currentMessage: '',
      userIsTyping: false,
      usersTyping: [],
      roomId: 'test123'
 }

 export default function chat(state = initalChatState, action) {
  
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
        default:
            return state;
    }
}