import * as types from './../../actions/Types';

import {
  RTCPeerConnection,
  RTCMediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';

const configuration = {
  "iceServers": [
     {
      url: 'turn:35.176.66.87:3478',
      credential: 'test',
      username: 'edo'
    },
  ]};


export default function createRTCMiddleware() {
    
    return ({ dispatch }) => {
        
        return next => (action) => {
            
            if(action.type === types.SERVER_JOIN_ROOM){
                socket = io('http://localhost:3000');
                emitBound = socket.emit.bind(socket);

                // Wire socket.io to dispatch actions sent by the server.
                socket.on(eventName, dispatch);
            }
            return next(action);
        };
    }
}