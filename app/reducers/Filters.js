import * as types from '../actions/Types';

const initialFilters = {
  searchFilters: {},
}

export default function filters(state = initialFilters, action) {
    switch (action.type) {
        case types.UPDATE_FILTERS:
          return { ...state, searchFilters: action.filters };
        default:
          return state;
      }
}