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
  switch (action.type) {
    case types.UPDATE_CONNECTION_STATUS:
        console.log('Web RTC connecting...');
      return { ...state, status: action.status, info: action.info };
    case types.SWITCH_CAMERA:
      return { ...state, isFront: action.isFrontCamera  };
    case types.SET_VIDEO_SOURCE:
        return { ...state, selfViewSrc: action.videoSrc};
    case types.UPDATE_TEXT_ROOM_DATA:
        return { ...state, textRoomData: action.textRoomData };
    case types.UPDATE_INFO:
        return { ...state, info: action.info };
    case types.UPDATE_CHANNEL_LIST:
        return { ...state, remoteList: action.remoteList };
    case types.SET_TEXT_ROOM_CONNECTED_STATE:
        return { ...state, textRoomConnected: action.textRoomConnected };
    case types.SET_ROOM:
        return { ...state, textRoomValue: action.textRoomValue };
    case types.SET_ROOM_ID:
        return { ...state, roomID: action.roomID };
    case types.REMOVE_PEER:
        const remoteList = state.remoteList;
        delete remoteList[action.peerId];
        return { ...state, remoteList: remoteList };
    default:
      return state;
  }
}
