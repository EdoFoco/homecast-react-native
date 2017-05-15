import * as types from '../actions/Types';

const initialAuthState = { isLoggedIn: false };

export default function auth(state = initialAuthState, action) {
  switch (action.type) {
    case types.LOGIN:
      console.log('Auth Login');
      return { ...state, isLoggedIn: action.isLoggedIn, user: action.user };
    case types.LOGOUT:
      return { ...state, isLoggedIn: action.isLoggedIn, user: action.user };
    default:
      return state;
  }
}
