import * as types from '../actions/Types';

const initialAuthState = { isLoggedIn: false, isAuthenticating: false };

export default function user(state = initialAuthState, action) {
  switch (action.type) {
    case types.LOGIN:
      console.log('Auth Login');
      return { ...state, isLoggedIn: action.isLoggedIn, user: action.user, isAuthenticating: action.isAuthenticating };
    case types.LOGOUT:
      return { ...state, isLoggedIn: action.isLoggedIn, user: action.user, isAuthenticating: action.isAuthenticating  };
    case types.LOGIN_FAILED:
        return { ...state, isLoggedIn: action.isLoggedIn, user: action.user, error: action.error, isAuthenticating: action.isAuthenticating };
    case types.AUTHENTICATING:
        return { ...state, isAuthenticating: action.isAuthenticating };
    default:
      return state;
  }
}
