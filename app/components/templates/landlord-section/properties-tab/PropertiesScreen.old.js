import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  ListView,
  ListViewDataSource,
  Platform,
} from 'react-native';

import io from 'socket.io-client';


import {
  RTCPeerConnection,
  RTCMediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';

const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};

const pcPeers = {};
let localStream;
var socket;

function getLocalStream(isFront, callback) {

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

function join(roomID) {
  socket.emit('join', roomID, function(socketIds){
    //console.log('join', socketIds);
    for (const i in socketIds) {
      const socketId = socketIds[i];
      createPC(socketId, true);
    }
  });
}

function createPC(socketId, isOffer) {
  const pc = new RTCPeerConnection(configuration);
  pcPeers[socketId] = pc;

  pc.onicecandidate = function (event) {
    //console.log('onicecandidate', event.candidate);
    if (event.candidate) {
      socket.emit('exchange', {'to': socketId, 'candidate': event.candidate });
    }
  };

  function createOffer() {
    pc.createOffer(function(desc) {
      //console.log('createOffer', desc);
      pc.setLocalDescription(desc, function () {
        //console.log('setLocalDescription', pc.localDescription);
        socket.emit('exchange', {'to': socketId, 'sdp': pc.localDescription });
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
    container.props.updateInfo( 'One peer join!' );

    const remoteList = container.props.webrtc.remoteList;
    remoteList[socketId] = event.stream.toURL();

    //Remote LIST STATE - updateChannelList
    container.props.updateChannelList( remoteList );
  };
  pc.onremovestream = function (event) {
    //console.log('onremovestream', event.stream);
  };

  pc.addStream(localStream);
  
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
      container.props.setTextRoomState(true);
    };

    dataChannel.onclose = function () {
      //console.log("dataChannel.onclose");
    };

    pc.textDataChannel = dataChannel;
  }
  return pc;
}

function exchange(data) {
  const fromId = data.from;
  let pc;
  if (fromId in pcPeers) {
    pc = pcPeers[fromId];
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
            socket.emit('exchange', {'to': fromId, 'sdp': pc.localDescription });
          }, logError);
        }, logError);
    }, logError);
  } else {
    //console.log('exchange candidate', data);
    pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
}

function leave(socketId) {
  //console.log('leave', socketId);
  const pc = pcPeers[socketId];
  const viewIndex = pc.viewIndex;
  pc.close();
  delete pcPeers[socketId];

  const remoteList = container.props.webrtc.remoteList;
  delete remoteList[socketId]

  //LEAVE ROOM STATE - updateChannelLIst
  container.props.updateChannelList( remoteList );
  //SET INFO - updateInfo
  container.props.updateInfo( 'One peer leave!' );
}

function initSocket(){
  socket = io.connect('https://react-native-webrtc.herokuapp.com', {transports: ['websocket']});

  socket.on('exchange', function(data){
    exchange(data);
  });

  socket.on('leave', function(socketId){
    leave(socketId);
  });

  socket.on('connect', function(data) {
    //console.log('connect');
    getLocalStream(true, function(stream) {
      localStream = stream;

      //SOCKET CONNECTED STATE
      container.props.setVideoSource( stream.toURL() );
      container.props.updateConnectionStatus('ready', 'Please enter or create room ID');
      
    });
});
}


function logError(error) {
  //console.log("logError", error);
}

function mapHash(hash, func) {
  const array = [];
  for (const key in hash) {
    const obj = hash[key];
    array.push(func(obj, key));
  }
  return array;
}

function getStats() {
  const pc = pcPeers[Object.keys(pcPeers)[0]];
  if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
    const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
    //console.log('track', track);
    pc.getStats(track, function(report) {
      //console.log('getStats report', report);
    }, logError);
  }
}

class PropertiesScreen extends Component{  
  
  
  componentWillMount(){
    container = this;
    initSocket();
  }

  _press(event) {
    //this.refs.roomID.blur();
    //Connect STATE - updateConnectionStatus
    this.props.updateConnectionStatus( 'connect', 'Connecting' );
    join(this.props.webrtc.roomID);
  }

  _switchVideoType() {
    const isFront = !this.props.webrtc.isFront;
    //Switch Camera STATE - switchCamera
    this.props.switchCamera( isFront );
    getLocalStream(isFront, function(stream) {
      if (localStream) {
        for (const id in pcPeers) {
          const pc = pcPeers[id];
          pc && pc.removeStream(localStream);
        }
        localStream.release();
      }
      localStream = stream;
      //SET VIDEO SOURCE STATE - setVideoSource
      container.props.setVideoSource( stream.toURL() );

      for (const id in pcPeers) {
        const pc = pcPeers[id];
        pc && pc.addStream(localStream);
      }
    });
  }

  receiveTextData(sender, data) {
    const textRoomData = this.props.webrtc.textRoomData.slice();
    const message = { user: sender, message: data };
    textRoomData.push(message);
    //RECEIVE TEXT STATE - receiveText
    this.props.receiveText(sender, textRoomData);
  }

  _textRoomPress() {
    if (!this.props.webrtc.textRoomValue) {
      return
    }
    const textRoomData = this.props.webrtc.textRoomData.slice();
    const message = { user: 'Me', message: this.props.webrtc.textRoomValue };
    textRoomData.push(message);
    for (const key in pcPeers) {

      //Send TExt Data
      const pc = pcPeers[key];
      pc.textDataChannel.send(this.props.webrtc.textRoomValue);
    }

    //Send TEXT STATE - sendText
    this.props.sendText( textRoomData, '');
  }

  _renderTextRoom() {
    
    return (
      <View style={styles.listViewContainer}>
        <ListView
          dataSource={this.props.textRoomData}
          renderRow={rowData => <Text>{rowData.user + ':' + rowData.message}</Text>}
          />
        <TextInput
          style={{width: 200, height: 30, borderColor: 'gray', borderWidth: 1}}
          onChangeText={value => this.props.setRoom( value )}
          value={this.props.webrtc.textRoomValue}
        />
        <TouchableHighlight
          onPress={this._textRoomPress.bind(this)}>
          <Text>Send</Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.props.webrtc.info}
        </Text>
        {this.props.webrtc.textRoomConnected && this._renderTextRoom()}
        <View style={{flexDirection: 'row'}}>
          <Text>
            {this.props.webrtc.isFront ? "Use front camera" : "Use back camera"}
          </Text>
          <TouchableHighlight
            style={{borderWidth: 1, borderColor: 'black' }}
            onPress={this._switchVideoType.bind(this)}>
            <Text>Switch camera</Text>
          </TouchableHighlight>
        </View>
        { this.props.webrtc.status == 'ready' ?
          (<View>
            <TextInput
              ref='roomID'
              autoCorrect={false}
              style={{width: 200, height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => this.props.setRoomId( text )}
              value={this.props.webrtc.roomID}
            />
            <TouchableHighlight
              onPress={this._press.bind(this)}>
              <Text>Enter room</Text>
            </TouchableHighlight>
          </View>) : null
        }
        <RTCView streamURL={this.props.webrtc.selfViewSrc} style={styles.selfView}/>
        {
          mapHash(this.props.webrtc.remoteList, function(remote, index) {
            return <RTCView key={index} streamURL={remote} style={styles.remoteView}/>
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  selfView: {
    width: 200,
    height: 150,
  },
  remoteView: {
    width: 200,
    height: 150,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  listViewContainer: {
    height: 150,
    backgroundColor: '#F9E9F9'
  },
});


const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

const mapStateToProps = (state) => {
    console.log('WebRTC State');
    console.log(state.webrtc);

    return {
        webrtc: state.webrtc,
        textRoomData:  ds.cloneWithRows(state.webrtc.textRoomData)
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesScreen);
