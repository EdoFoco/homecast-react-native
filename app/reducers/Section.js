import * as types from '../actions/Types';

const initialSectionState = { sectionName: 'guest' };

export default function user(state = initialSectionState, action) {
  switch (action.type) {
    case types.GOTO_SECTION:
      console.log('Section Changed');
      return { ...state, sectionName: action.sectionName };
    default:
      return state;
  }
}
