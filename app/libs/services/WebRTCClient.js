import * as WebRTCActions from '../../actions/WebRTC';
import io from 'socket.io-client';

class WebRTCClient {
  
  constructor(){
    this.configuration = {
                        "iceServers": [
                            {
                            url: 'turn:35.176.66.87:3478',
                            credential: 'test',
                            username: 'edo'
                            }
                        ]};

    this.pcPeers = {};
    this.localStream;
    this.socket;
  }

getLocalStream(isFront, callback) {

  let videoSourceId;

  // on android, you don't have to specify sourceId manually, just use facingMode
  // uncomment it if you want to specify
  if (Platform.OS === 'ios') {
    MediaStreamTrack.getSources(sourceInfos => {
      //console.log("sourceInfos: ", sourceInfos);

      for (const i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
        }
      }
    });
  }
  getUserMedia({
    audio: true,
    video: {
      mandatory: {
        minWidth: 640, // Provide your own width, height and frame rate here
        minHeight: 360,
        minFrameRate: 30,
      },
      facingMode: (isFront ? "user" : "environment"),
      optional: (videoSourceId ? [{sourceId: videoSourceId}] : []),
    }
  }, function (stream) {
    //console.log('getUserMedia success', stream);
    callback(stream);
  }, logError);
}

join(roomID) {
  this.socket.emit('join', roomID, function(socketIds){
    //console.log('join', socketIds);
    for (const i in socketIds) {
      const socketId = socketIds[i];
      createPC(socketId, true);
    }
  });
}

createPC(socketId, isOffer) {
  const pc = new RTCPeerConnection(configuration);
  this.pcPeers[socketId] = pc;

  pc.onicecandidate = function (event) {
    //console.log('onicecandidate', event.candidate);
    if (event.candidate) {
      this.socket.emit('exchange', {'to': socketId, 'candidate': event.candidate });
    }
  };

  function createOffer() {
    pc.createOffer(function(desc) {
      //console.log('createOffer', desc);
      pc.setLocalDescription(desc, function () {
        //console.log('setLocalDescription', pc.localDescription);
        this.socket.emit('exchange', {'to': socketId, 'sdp': pc.localDescription });
      }, logError);
    }, logError);
  }

  pc.onnegotiationneeded = function () {
    //console.log('onnegotiationneeded');
    if (isOffer) {
      createOffer();
    }
  }

  pc.oniceconnectionstatechange = function(event) {
    //console.log('oniceconnectionstatechange', event.target.iceConnectionState);
    if (event.target.iceConnectionState === 'completed') {
      setTimeout(() => {
        getStats();
      }, 1000);
    }
    if (event.target.iceConnectionState === 'connected') {
      createDataChannel();
    }
  };
  pc.onsignalingstatechange = function(event) {
    //console.log('onsignalingstatechange', event.target.signalingState);
  };

  pc.onaddstream = function (event) {
    //console.log('onaddstream', event.stream);

    //PEER CONNECTED STATE - updateInfo
    WebRTCActions.updateInfo( 'One peer join!' );

    const remoteList = WebRTCActions.webrtc.remoteList;
    remoteList[socketId] = event.stream.toURL();

    //Remote LIST STATE - updateChannelList
    WebRTCActions.updateChannelList( remoteList );
  };
  pc.onremovestream = function (event) {
    //console.log('onremovestream', event.stream);
  };

  pc.addStream(this.localStream);

  function createDataChannel() {
    if (pc.textDataChannel) {
      return;
    }
    const dataChannel = pc.createDataChannel("text");

    dataChannel.onerror = function (error) {
      //console.log("dataChannel.onerror", error);
    };

    dataChannel.onmessage = function (event) {
      //console.log("dataChannel.onmessage:", event.data);
      container.receiveTextData(socketId, event.data );
    };

    dataChannel.onopen = function () {
      //console.log('dataChannel.onopen');

      //SET STATE ROOM CONNECTED - SET_CONNECTED_STATE
      WebRTCActions.setTextRoomState(true);
    };

    dataChannel.onclose = function () {
      //console.log("dataChannel.onclose");
    };

    pc.textDataChannel = dataChannel;
  }
  return pc;
}

exchange(data) {
  const fromId = data.from;
  let pc;
  if (fromId in this.pcPeers) {
    pc = this.pcPeers[fromId];
  } else {
    pc = createPC(fromId, false);
  }

  if (data.sdp) {
    //console.log('exchange sdp', data);
    pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
      if (pc.remoteDescription.type == "offer")
        pc.createAnswer(function(desc) {
          //console.log('createAnswer', desc);
          pc.setLocalDescription(desc, function () {
            //console.log('setLocalDescription', pc.localDescription);
            this.socket.emit('exchange', {'to': fromId, 'sdp': pc.localDescription });
          }, logError);
        }, logError);
    }, logError);
  } else {
    //console.log('exchange candidate', data);
    pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
}

leave(socketId) {
  //console.log('leave', socketId);
  const pc = this.pcPeers[socketId];
  const viewIndex = pc.viewIndex;
  pc.close();
  delete this.pcPeers[socketId];

  //TODO: CHeck this
  WebRTCActions.removePeer(socketId);
  //const remoteList = container.props.webrtc.remoteList;
  //delete remoteList[socketId]

  //LEAVE ROOM STATE - updateChannelLIst
  WebRTCActions.updateChannelList( remoteList );
  //SET INFO - updateInfo
  WebRTCActions.updateInfo( 'One peer leave!' );
}

sendMessage( message ){
      
    for (const key in this.pcPeers) {
      const pc = this.pcPeers[key];
      pc.textDataChannel.send(message);
    }
}

initSocket(){
  this.socket = io.connect('https://react-native-webrtc.herokuapp.com', {transports: ['websocket']});

  this.socket.on('exchange', function(data){
    exchange(data);
  });

  this.socket.on('leave', function(socketId){
    leave(socketId);
  });

  this.socket.on('connect', function(data) {
    //console.log('connect');
        getLocalStream(true, function(stream) {
            this.localStream = stream;

            //SOCKET CONNECTED STATE
            WebRTCActions.setVideoSource( stream.toURL() );
            WebRTCActions.updateConnectionStatus('ready', 'Please enter or create room ID');
            
        });
    });
}


logError(error) {
  console.log("logError", error);
}

mapHash(hash, func) {
  const array = [];
  for (const key in hash) {
    const obj = hash[key];
    array.push(func(obj, key));
  }
  return array;
}

getStats() {
  const pc = this.pcPeers[Object.keys(this.pcPeers)[0]];
  if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
    const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
    //console.log('track', track);
    pc.getStats(track, function(report) {
      //console.log('getStats report', report);
    }, logError);
  }
}

}
export default WebRTCClient