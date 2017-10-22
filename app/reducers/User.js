import * as types from '../actions/Types';

const initialAuthState = { 
  isLoggedIn: false, 
  isAuthenticating: true,
  authToken: '',
  info: null
 };

export default function user(state = initialAuthState, action) {
  switch (action.type) {
    case types.LOGIN:
      return { ...state, isLoggedIn: action.isLoggedIn, user: action.user, isAuthenticating: action.isAuthenticating };
    case types.LOGOUT:
      return { ...state, ...initialAuthState };
    case types.LOGIN_FAILED:
        return { ...state, isLoggedIn: action.isLoggedIn, user: action.user, error: action.error, isAuthenticating: action.isAuthenticating };
    case types.AUTHENTICATING:
        return { ...state, isAuthenticating: action.isAuthenticating };
    case types.UPDATE_AUTH_TOKEN:
        return { ...state, authToken: action.token };
    case types.UNAUTHORIZED_USER:
        return { ...state, isAuthenticating: false, token: '', isLoggedIn: false };
    case types.UPDATE_USER_INFO:
        return { ...state, isAuthenticating: false, isLoggedIn: true, info: action.user };
    default:
      return state;
  }
}
