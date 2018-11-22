//Generic
export const NETWORK_ERROR = 'NETWORK_ERROR';
export const UPDATE_SIGNAL_STRENGTH = 'UPDATE_SIGNAL_STRENGTH';

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
export const UPDATE_VIEWING = 'UPDATE_VIEWING';
export const UPDATE_VIEWING_RESERVATIONS = 'UPDATE_VIEWING_RESERVATIONS';

//Property Screen 
export const UPDATE_PROPERTY_ACTIVE_TAB = 'UPDATE_PROPERTY_ACTIVE_TAB';

//Navigation
export const GOTO_SCREEN = 'GOTO_SCREEN';
export const GOTO_GUEST_TAB_BAR = 'GOTO_GUEST_TAB_BAR';
export const GOTO_SECTION = 'GOTO_SECTION';
export const GO_TO_PROPERTIES_HOME = 'GO_TO_PROPERTIES_HOME';
export const GO_TO_CHATS_HOME = 'GO_TO_CHATS_HOME';

//Locatin
export const UPDATE_LOCATION_SUGGESTIONS = 'UPDATE_LOCATION_SUGGESTIONS';

//Sockets
export const SERVER_CONNECT = 'server/connect';
export const SERVER_DISCONNECT = 'server/disconnect';
export const SERVER_JOIN_ROOM = 'server/joinRoom';
export const SERVER_ROOM_STATUS = 'server/roomStatus';
export const SERVER_USER_IS_TYPING = 'server/userIsTyping';
export const CLIENT_UPDATE_TYPING_USERS = 'client/updateTypingUsers';
export const CLIENT_USERS_UPDATED = 'client/usersUpdated'; //Either joined or left room
export const CLIENT_ROOM_STATUS = 'client/roomStatus';
export const CLIENT_CONNECTED = 'connect';
export const CLIENT_RECONNECTED = 'reconnect';
export const CLIENT_VIEWER_RESPONSE = 'viewerResponse';
export const CLIENT_PRESENTER_RESPONSE = 'presenterResponse';

//Chat
export const CHAT_MESSAGE_CHANGED = 'CHAT_MESSAGE_CHANGED';
export const SET_IS_PRESENTER = 'IS_PRESENTER';
export const SET_SOCKET_ERROR = 'SOCKET_ERROR';
export const CLIENT_MESSAGE = 'client/message';
export const SERVER_MESSAGE = 'server/message';
export const UPDATE_ROOM_ID = 'UPDATE_ROOM_ID';
export const UPDATE_CHATS = 'UPDATE_CHATS';

//WebRTC
export const UPDATE_CONNECTION_STATUS = 'UPDATE_CONNECTION_STATUS';

//Navigation
export const GO_TO_GUEST_PROPERTIES_TAB = 'Navigation/GO_TO_GUEST_PROPERTIES_SCREEN'
export const GO_TO_PROPERTIES_TAB_VIEWING = 'Navigation/GO_TO_PROPERTIES_TAB_VIEWING';
export const PROPERTIES_TAB_GO_BACK = 'Navigation/PROPERTIES_TAB_GO_BACK';
export const PROPERTIES_TAB_GO_TO_PROPERTY = 'Navigation/PROPERTIES_TAB_GO_TO_PROPERTY';
export const GO_TO_CHATS_TAB = 'GO_TO_CHATS_TAB';
export const GO_TO_CHAT = 'GO_TO_CHAT';
export const RETURN_TO_GUEST_TAB_BAR = 'RETURN_TO_GUEST_TAB_BAR';
export const FAVOURITES_TAB_GO_TO_PROPERTY = 'FAVOURITES_TAB_GO_TO_PROPERTY';
export const GUEST_VIEWINGS_TAB_GO_TO_VIEWING = 'GUEST_VIEWINGS_TAB_GO_TO_VIEWING';
export const CHATS_TAB_GO_TO_CHAT = 'CHATS_TAB_GO_TO_CHAT';
export const LANDLORD_VIEWINGS_TAB_GO_TO_VIEWING = 'LANDLORD_VIEWINGS_TAB_GO_TO_VIEWING';

//Scrapers
export const UPDATE_SCRAPERS = 'UPDATE_SCRAPERS';

//Filters
export const UPDATE_FILTERS = 'UPDATE_FILTERS';

//General Reducers
export const RESET_REDUCERS = 'RESET_REDUCERS';