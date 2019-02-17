import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chat from './Chat';
import * as Colors from '../helpers/ColorPallette';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenLoader from '../molecules/ScreenLoader';
import InCallManager from 'react-native-incall-manager';
import WebRtcAdaptor from '../../libs/third-party/AntMedia/WebRtcAdaptor';
import SocketIoService from '../../libs/services/SocketIoService';
import * as SocketStatus from '../../libs/services/SocketStatus';
import * as WebRtcEvents from '../../libs/third-party/AntMedia/WebRtcEvents';
import * as SocketCommands from '../../libs/services/SocketCommands';
import { 
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Text} from 'react-native';

 import { RTCView } from 'react-native-webrtc';

export default class WebRTCChat extends Component{
 
  constructor(props){
    super(props);
    this.state = {
      webRtcConnectionStatus: SocketStatus.CONNECTING,
      chatConnectionStatus: SocketStatus.CONNECTING,
      connectionMessage: 'Connecting',
      streamId: null,
      chatEvents: [],
      stream: null,
      errorMessage: null,
      roomDetails: null
    }
  }

  componentDidMount(){
    this._initChat();
  }

  componentWillUnmount(){
    this._disconnectWebRtcAdaptor();
    this._disconnectChat();
  }

  _initChat(){
    console.log(`viewing-${this.props.viewing.id}`);
    this.socketIoService = new SocketIoService((status, data) => {this._onChatChangeStatus(status, data)}, (message) => {this._onMessageReceived(message)}, (event, data) => { this._onChatEvent(event, data) } );
  }

  _onChatChangeStatus(status, data){
    switch(status){
      case SocketStatus.CONNECTED:
        console.log('Chat Connected');
        this.setState({ chatConnectionStatus: SocketStatus.CONNECTED });
        this.socketIoService.joinRoom(`viewing-${this.props.viewing.id}`, this.props.user.info);
        break;
      case SocketStatus.ERROR_CONNECTING:
        console.log('Socket.Io Connection Error');
        this._disconnectWebRtcAdaptor();
        this._disconnectChat();
        this.setState({ errorMessage: "Connection error. \r\n\r\nCheck your internet connection and try again." });
        break;
      case SocketStatus.RECONNECTING:
        console.log('Socket.Io Reconnecting');
        this.setState({ chatConnectionStatus: SocketStatus.RECONNECTING });
        this.setState({ connectionMessage: "Reconnecting" })
    }
  }

  _onChatEvent(event, data){
    console.log(`Chat Event: ${event}`, data);
    if(event === SocketCommands.ON_ROOM_JOINED){
      this.socketIoService.getRoomDetails(this.props.user.info);
    }
    if(event === SocketCommands.ON_ROOM_DETAILS){
      console.log('Room Details: ', JSON.parse(data));
      var roomDetails = JSON.parse(data);
      this.setState({roomDetails: roomDetails});
      if(!roomDetails.stream){
        this.setState({errorMessage: "This viewing hasn't started yet or has just ended. \r\n\r\nContact the estate agent for more info."});
      }
      else{
        if(this.state.webRtcConnectionStatus != SocketStatus.CONNECTED){
          this._initWebRtcAdaptor();
        }
      }
    }
    if(event === SocketCommands.ON_STREAM_REMOVED){
      this.setState({stream: null, errorMessage: "The agent lost connection. Waiting to reconnect..."});
      this._disconnectWebRtcAdaptor();
      this.reconnectTimer = setTimeout(() => {
        this._disconnectChat();
        this.setState({ errorMessage: "Call Ended" });
      }, 20000);
    }
    if(event === SocketCommands.ON_STREAM_ADDED){
      if(this.reconnectTimer){
        clearTimeout(this.reconnectTimer);
      }

      this.socketIoService.getRoomDetails(this.props.user.info);
    }
  }

  _disconnectChat(){
    if(this.socketIoService && this.state.chatConnectionStatus != SocketStatus.DISCONNECTED){
      if(this.state.streamId){
        this.setState({streamId: null});
       }
  
       this.socketIoService.disconnect();
    }
    this.setState({ chatConnectionStatus: SocketStatus.DISCONNECTED});
  }

  _onMessageReceived(message){
    console.log('Received Message', message);
  }

  _initWebRtcAdaptor(){
    var pc_config = null;

    var sdpConstraints = {
      OfferToReceiveAudio : false,
      OfferToReceiveVideo : false

    };
    
    var mediaConstraints = {
      video : true,
      audio : true
    };

    this.webRtcAdaptor = new WebRtcAdaptor({
      mediaConstraints : mediaConstraints,
      peerconnection_config : pc_config,
      sdp_constraints : sdpConstraints,
      debug: false,
      setRemoteSource: (source) => {this.setState({stream: source})},
      onConnect: () => { this._onWebRtcConnected()},
      onEvent: (event, data) => { this._onWebRtcEvent(event, data) },
      onError : (error, message) => { this._handleWebRtcError(error) }
    });
  }

  _onWebRtcConnected(){
    console.log('WebRtc Connected');
    this.setState({ webRtcConnectionStatus: SocketStatus.CONNECTED });

    console.log(this.state.roomDetails);
    if(this.state.roomDetails.stream){
      console.log(`Playing stream: ${this.state.roomDetails.stream.id}`);
      this.webRtcAdaptor.play(this.state.roomDetails.stream.id);
    }
  }

  _onWebRtcEvent(event, data) {
    console.log('WebRtcEvent: ', event, data);
    
    // if(event == WebRtcEvents.PUBLISH_STARTED){
    //   console.log("publish started");
    //   this.socketIoService.addStream(this.props.user.info, this.state.streamId);
    // } else if (event == WebRtcEvents.PUBLISHED_FINISHED) {
    //   console.log("publish finished");
    //   this.socketIoService.removeStream(this.props.user.info, this.state.streamId);
    // }
    if (event == WebRtcEvents.CLOSED) {
      this._disconnectChat();
      
      if (typeof description != "undefined") {
        console.log("Connecton closed: " + JSON.stringify(description));
      }
    }
  }

  _handleWebRtcError(error) {
    console.log('WebRtc Error: ', error);
    this._disconnectWebRtcAdaptor();
    
    var errorMessage = 'Connection error. Try again later.';
    try{
      errorMessage = JSON.stringify(error);
    }
    catch(e){
      //Do nothing;
    }

    if (typeof message != "undefined") {
      errorMessage = message;
    }
   
    if (errorMessage.indexOf("NotFoundError") != -1) {
      errorMessage = "Camera or Mic are not found or not allowed in your device";
    }
    else if (errorMessage.indexOf("NotReadableError") != -1 || errorMessage.indexOf("TrackStartError") != -1) {
      errorMessage = "Camera or Mic is being used by some other process that does not let read the devices";
    }
    else if(errorMessage.indexOf("OverconstrainedError") != -1 || errorMessage.indexOf("ConstraintNotSatisfiedError") != -1) {
      errorMessage = "There is no device found that fits your video and audio constraints. You may change video and audio constraints"
    }
    else if (errorMessage.indexOf("NotAllowedError") != -1 || errorMessage.indexOf("PermissionDeniedError") != -1) {
      errorMessage = "You are not allowed to access camera and mic.";
    }
    else if (errorMessage.indexOf("TypeError") != -1) {
      errorMessage = "Video/Audio is required";
    }
    console.error('WebRtc Error: ', errorMessage);
    this.setState({ errorMessage: errorMessage });
  }
  
  _disconnectWebRtcAdaptor(){
    if(this.webRtcAdaptor && this.state.webRtcConnectionStatus != SocketStatus.DISCONNECTED){
      this.webRtcAdaptor.disconnect();
    }
    this.setState({webRtcConnectionStatus: SocketStatus.DISCONNECTED});
  }

  _endCall(){
     InCallManager.stop();

     this._disconnectWebRtcAdaptor();
     this._disconnectChat();
     
     this.props.goBack();
  }

  render() {
    if(this.state.webRtcConnectionStatus != SocketStatus.CONNECTED || this.state.chatConnectionStatus != SocketStatus.CONNECTED){
      return <ScreenLoader message={this.state.connectionMessage} errorMessage = { this.state.errorMessage} goBack={() => {this._endCall()}}/>
    }
    
    if(this.state.chatConnectionStatus == SocketStatus.CONNECTING 
      || this.state.webRtcConnectionStatus == SocketStatus.CONNECTING
      || this.state.stream == null){
        return(
            <ScreenLoader message='Getting ready to stream...' goBack={() => {this._endCall() }}/>
        )
     }

    return (
      <RTCView streamURL={this.state.stream.toURL()} style={styles.remoteView}  objectFit ='cover'>
            <View style={styles.videoCommands}>
              <TouchableHighlight onPress={()=>{ this._setAudioMute()}} style={styles.muteBtn}>
                    <MCIcon name="volume-off" style={styles.muteIcon} />
              </TouchableHighlight>
              <TouchableHighlight style={styles.hangUpBtn} onPress={() => {this._endCall()}}>
                  <MCIcon name="phone-hangup" style={styles.hangupIcon} />
              </TouchableHighlight>
          </View>
          <Chat chat={this.props.chat} user={this.props.user} sendMessage={(roomId, username, message) => { this.props.sendMessage(roomId, username, message)}}/>
      </RTCView>
    );
  }
}


WebRTCChat.PropTypes = {
  chat: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  sendMessage: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  publishEvent: PropTypes.func.isRequired,
  iceCandidates: PropTypes.array.isRequired,
  sdpAnswer: PropTypes.object.isRequired,
  hasError: PropTypes.bool.isRequired,
  viewing: PropTypes.object.isRequired
}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    width: 100
  },
  listViewContainer: {
    marginTop: 0,
    paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0)',
    alignSelf: 'stretch',
    flex: 1
  },
  chatContainer: {
    marginTop: 0,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'rgba(0,0,0,0)',
    alignSelf: 'stretch',
    flex: 1
  },
  chatInputGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
   remoteView: {
    alignSelf: 'flex-start',
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#4DD0E1'
   
  },
  videoContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#F5FCFF',
     flexDirection: 'column'
  },
  videoCommands: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 40
  },
  muteBtn: {
    width: 60,
    height: 60,
    backgroundColor: Colors.LIGHT_BLUE,
    alignSelf: 'flex-start',
    marginRight: 10,
    borderRadius: 40,
    justifyContent: 'center',
    paddingLeft: 5
  },
  hangUpBtn: {
    width: 60,
    height: 60,
    backgroundColor: Colors.RED,
    alignSelf: 'flex-start',
    borderRadius: 40,
    justifyContent: 'center'
  },
  muteIcon: {
    fontSize: 28,
    color: 'white',
    width: 30,
    alignSelf: 'center'
  },
  hangupIcon: {
    fontSize: 28,
    color: 'white',
    width: 30,
    alignSelf: 'center'
  }
});