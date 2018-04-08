import * as types from '../actions/Types';

const initialLocationSuggestions = {
     filters: [],
}

export default function locationSuggestions(state = initialLocationSuggestions, action) {
    switch (action.type) {
        case types.UPDATE_LOCATION_SUGGESTIONS:
          return { ...state, suggestions: action.suggestions };
        default:
          return state;
      }
}