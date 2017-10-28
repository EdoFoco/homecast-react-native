// Auth
export const AUTHENTICATING = 'AUTHENTICATING';
export const LOGIN = 'LOGIN';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGOUT = 'LOGOUT';

//User
export const UPDATE_USER_INFO = 'UPDATE_INFO_USER';
export const UPDATE_AUTH_TOKEN = 'UPDATE_AUTH_TOKEN';
export const UNAUTHORIZED_USER = 'UNAUTHORIZED_USER';

//Properties
export const UPDATE_PROPERTIES_LIST = 'UPDATE_PROPERTIES_LIST';
export const UPDATE_CURRENT_PROPERTY = 'UPDATE_CURRENT_PROPERTY';

//Viewings
export const UPDATE_VIEWINGS_LOADED = 'UPDATE_VIEWINGS_LOADED';
export const UPDATE_VIEWING = 'UPDATE_VIEWING';
export const UPDATE_VIEWING_RESERVATIONS = 'UPDATE_VIEWING_RESERVATIONS';

//Property Screen 
export const UPDATE_PROPERTY_ACTIVE_TAB = 'UPDATE_PROPERTY_ACTIVE_TAB';

//Navigation
export const GOTO_SCREEN = 'GOTO_SCREEN';
export const GOTO_GUEST_TAB_BAR = 'GOTO_GUEST_TAB_BAR';
export const UPDATE_CURRENT_PROPERTY_VIEWINGS = 'UPDATE_CURRENT_PROPERTY_VIEWINGS';

//Section Changed
export const GOTO_SECTION = 'GOTO_SECTION';


//Sockets
export const SERVER_CONNECT = 'server/connect';
export const SERVER_DISCONNECT = 'server/disconnect';
export const SERVER_JOIN_ROOM = 'server/joinRoom';
export const SERVER_USER_IS_TYPING = 'server/userIsTyping';
export const CLIENT_UPDATE_TYPING_USERS = 'client/updateTypingUsers';
export const CLIENT_USERS_UPDATED = 'client/usersUpdated'; //Either joined or left room
export const CLIENT_CONNECTED = 'connect';
export const CLIENT_RECONNECTED = 'reconnect';
export const CLIENT_VIEWER_RESPONSE = 'viewerResponse'; 

//Chat
export const CHAT_MESSAGE_CHANGED = 'CHAT_MESSAGE_CHANGED';
export const SET_IS_PRESENTER = 'IS_PRESENTER';
export const SET_SOCKET_ERROR = 'SOCKET_ERROR';
export const CLIENT_MESSAGE = 'client/message';
export const SERVER_MESSAGE = 'server/message';
export const UPDATE_ROOM_ID = 'UPDATE_ROOM_ID';

//WebRTC
export const PRESENTER_IS_READY = 'client/presenterResponse';
export const UPDATE_CONNECTION_STATUS = 'UPDATE_CONNECTION_STATUS';

