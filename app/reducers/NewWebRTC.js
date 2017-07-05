import * as types from '../actions/Types';

const initialConferenceState = { 
      info: 'Initializing',
      status: 'init',
      roomID: '',
      isFront: false,
      selfViewSrc: null,
      remoteList: {},
      textRoomConnected: false,
      textRoomData: [],
      textRoomValue: '',
};

export default function webrtc(state = initialConferenceState, action) {
  switch(action.type){
    case 'message':
      return Object.assign({}, {message:action.data});
    default:
      return state;
  }
}
