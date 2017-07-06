// Auth
export const AUTHENTICATING = 'AUTHENTICATING';
export const LOGIN = 'LOGIN';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGOUT = 'LOGOUT';

//Navigation
export const GOTO_SCREEN = 'GOTO_SCREEN';
export const GOTO_GUEST_TAB_BAR = 'GOTO_GUEST_TAB_BAR';

//Section Changed
export const GOTO_SECTION = 'GOTO_SECTION';

//WebRTC
export const CONNECT = 'CONNECT';
export const UPDATE_CONNECTION_STATUS = 'UPDATE_CONNECTION_STATUS';
export const SWITCH_CAMERA = 'SWITCH_CAMERA';
export const SET_VIDEO_SOURCE = 'SET_VIDEO_SOURCE';
export const UPDATE_TEXT_ROOM_DATA = 'UPDATE_TEXT_ROOM_DATA';
export const UPDATE_INFO = 'UPDATE_INFO';
export const UPDATE_CHANNEL_LIST = 'UPDATE_CHANNEL_LIST';
export const SET_TEXT_ROOM_CONNECTED_STATE = 'SET_TEXT_ROOM_CONNECTED_STATE';
export const SET_ROOM = 'SET_ROOM';
export const SET_ROOM_ID = 'SET_ROOM_ID';
export const REMOVE_PEER = 'REMOVE_PEER';

//Socket.io
export const SERVER_MESSAGE = 'server/message';
export const CLIENT_MESSAGE = 'client/message';
export const SERVER_DISCONNECT = 'server/disconnect';
export const SERVER_JOIN_ROOM = 'server/joinRoom';
export const SERVER_USER_IS_TYPING = 'server/userIsTyping';
export const CLIENT_UPDATE_TYPING_USERS = 'client/updateTypingUsers';
export const CLIENT_USERS_UPDATED = 'client/usersUpdated'; //Either joined or left room
export const CLIENT_CONNECTED = 'connect';
export const CLIENT_RECONNECTED = 'reconnect';

//Chat
export const CHAT_MESSAGE_CHANGED = 'CHAT_MESSAGE_CHANGED';
export const SET_IS_PRESENTER = 'IS_PRESENTER';

//WebRTC
export const CREATE_PEER_CONNECTION = 'CREATE_PEER_CONNECTION';