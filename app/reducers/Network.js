import * as types from '../actions/Types';

const initialNetworkState = { hasError: false, signalStrength: null };

export default function network(state = initialNetworkState, action) {
  switch (action.type) {
    case types.NETWORK_ERROR:
      return { ...state, hasError: action.hasError };
    case types.UPDATE_SIGNAL_STRENGTH:
      return { ...state, signalStrength: action.strength };
    default:
      return state;
  }
}
