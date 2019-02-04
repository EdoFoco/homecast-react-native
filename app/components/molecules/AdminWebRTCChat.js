import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chat from './Chat';
import * as Colors from '../helpers/ColorPallette';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as FontSizes from '../helpers/FontSizes';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import InCallManager from 'react-native-incall-manager';
import ScreenLoader from '../molecules/ScreenLoader';
import WebRtcAdaptor from '../../libs/third-party/AntMedia/WebRtcAdaptor';
import SocketIoService from '../../libs/services/SocketIoService';
import * as SocketStatus from '../../libs/services/SocketStatus';
import { 
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  } from 'react-native';

 import { RTCView } from 'react-native-webrtc';

var localStream;

export default class AdminWebRTCChat extends Component{
 
  constructor(props){
    super(props);
    this.state = {
      webRtcConnectionStatus: SocketStatus.CONNECTING,
      chatConnectionStatus: SocketStatus.CONNECTING,
      connectionMessage: 'Connecting',
      streamId: null,
      chatEvents: [],
      stream: null,
      errorMessage: null
    }
  }

  componentDidMount(){
    this._initChat();
  }

  _initChat(){
    console.log(`viewing-${this.props.viewing.id}`);
    this.socketIoService = new SocketIoService((status, data) => {this._onChatChangeStatus(status, data)}, (message) => {this._onMessageReceived(message)} );
    this.socketIoService.joinRoom(`viewing-${this.props.viewing.id}`, {id: this.props.user.info.id, name: this.props.user.info.name});
  }

  _onChatChangeStatus(status, data){
    switch(status){
      case SocketStatus.CONNECTED:
        console.log('Chat Connected');
        this.setState({ chatConnectionStatus: SocketStatus.CONNECTED });
        this.socketIoService.joinRoom(`viewing-${this.props.viewing.id}`, this.props.user.info);
        this._initWebRtcAdaptor();
        break;
      case SocketStatus.ERROR_CONNECTING:
        console.log('Socket.Io Connection Error');
        this.setState({ errorMessage: "Connection error. \r\n\r\nCheck your internet connection and try again." });
        break;
      case SocketStatus.RECONNECTING:
        console.log('Socket.Io Reconnecting');
        this.setState({ connectionMessage: "Reconnecting" })
    }
    
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
      callback : (info, description) => {
        console.log('Status:', info);
        if (info == "initialized") {
          console.log("initialized");
        } else if (info == "publish_started") {
          console.log("publish started");
          this.socketIoService.addStream(this.props.user.info, this.state.streamId);
        } else if (info == "publish_finished") {
          console.log("publish finished");
          this.socketIoService.removeStream(this.props.user.info, this.state.streamId);
        }
        else if (info == "closed") {
          //console.log("Connection closed");
          if (typeof description != "undefined") {
            console.log("Connecton closed: " + JSON.stringify(description));
          }
        }
      },
      onConnect: () => { this._onWebRtcConnected()},
      onEvent: (event, data) => { this._onWebRtcEvent(event, data) },
      onError : function(error, message) {
        //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
              
        console.log("error callback: " +  JSON.stringify(error));
        var errorMessage = JSON.stringify(error);
        if (typeof message != "undefined") {
          errorMessage = message;
        }
        var errorMessage = JSON.stringify(error);
        if (error.indexOf("NotFoundError") != -1) {
          errorMessage = "Camera or Mic are not found or not allowed in your device";
        }
        else if (error.indexOf("NotReadableError") != -1 || error.indexOf("TrackStartError") != -1) {
          errorMessage = "Camera or Mic is being used by some other process that does not let read the devices";
        }
        else if(error.indexOf("OverconstrainedError") != -1 || error.indexOf("ConstraintNotSatisfiedError") != -1) {
          errorMessage = "There is no device found that fits your video and audio constraints. You may change video and audio constraints"
        }
        else if (error.indexOf("NotAllowedError") != -1 || error.indexOf("PermissionDeniedError") != -1) {
          errorMessage = "You are not allowed to access camera and mic.";
        }
        else if (error.indexOf("TypeError") != -1) {
          errorMessage = "Video/Audio is required";
        }
        console.error(errorMessage);
        this.setState({ errorMessage: errorMessage });
      }
    });
  }

  _onWebRtcConnected(){
    console.log('WebRtc Connected');
    this.setState({ webRtcConnectionStatus: SocketStatus.CONNECTED });
    
    var streamId = Math.random().toString(36).substring(7);
    this.setState({streamId: streamId});
    this.webRtcAdaptor.startMedia()
    .then(() => {
      this.webRtcAdaptor.publish(streamId);
    })
    .catch((e) => {
      this.setState({errorMessage: 'There was a problem with your camera or microphone.'});
    });
  }

  _onWebRtcEvent(event, data) {
    console.log('WebRtcEvent: ', event, data);
  }

  _endCall(){
     InCallManager.stop();
    
     if(this.state.streamId){
      this.socketIoService.removeStream(this.props.user.info, this.state.streamId);
      this.socketIoService.removeStream(this.props.user.info, this.state.streamId);
      this.webRtcAdaptor.closeStream(this.state.streamId);
     }

     this.webRtcAdaptor.disconnect();
     this.socketIoService.disconnect();
     this.props.goBack();
  }

  _setMute(){
    this.setState({ isMicrophoneMute: !this.state.isMicrophoneMute }, () => {
      let tracks = localStream.getTracks();
      if (tracks.length > 0) {
          tracks.forEach((track) => {
              if(track.kind === 'audio'){
                track.enabled = !this.state.isMicrophoneMute;
              }
          })  
          InCallManager.setMicrophoneMute(this.state.isMicrophoneMute);
        }   
    });
  }

  
  render() {
      console.log(this.state);
      if(this.state.webRtcConnectionStatus != SocketStatus.CONNECTED || this.state.chatConnectionStatus != SocketStatus.CONNECTED){
        return <ScreenLoader message={this.state.connectionMessage} errorMessage = { this.state.errorMessage} goBack={() => {this._endCall()}}/>
      }
      
      if(this.state.chatConnectionStatus == SocketStatus.CONNECTING 
        || this.state.webRtcConnectionStatus == SocketStatus.CONNECTING
        || this.state.stream == null){
          return(
              <ScreenLoader message='Getting ready to broadcast...' goBack={() => {this._endCall() }}/>
          )
       }

      return (
        <RTCView streamURL={this.state.stream.toURL()} style={styles.remoteView}  objectFit ='cover'>
            <View style={styles.videoCommands}>
              <TouchableHighlight onPress={()=>{ this._setMute()}} style={styles.muteBtn}>
                {
                  !this.state.isMicrophoneMute ?
                  <FontAwesomeIcon name="microphone-slash" style={styles.muteIcon} /> :
                  <FontAwesomeIcon name="microphone" style={styles.muteIcon} />
                }
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

AdminWebRTCChat.propTypes = {
  chat: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  viewing: PropTypes.object.isRequired,
  sendMessage: PropTypes.func.isRequired,
  network: PropTypes.object.isRequired,
  publishEvent: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
  goBack: PropTypes.func.isRequired
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
    fontSize: FontSizes.DEFAULT,
    color: 'white',
    width: 20,
    alignSelf: 'center'
  },
  hangupIcon: {
    fontSize: 28,
    color: 'white',
    width: 30,
    alignSelf: 'center'
  }
});