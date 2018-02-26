import * as types from '../actions/Types';

const initialNetworkState = { hasError: false };

export default function network(state = initialNetworkState, action) {
  switch (action.type) {
    case types.NETWORK_ERROR:
      return { ...state, hasError: action.hasError };
    default:
      return state;
  }
}
