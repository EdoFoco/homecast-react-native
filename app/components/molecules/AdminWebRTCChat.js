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
import { 
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Text} from 'react-native';

 import {
  RTCView } from 'react-native-webrtc';


var localStream;

export default class AdminWebRTCChat extends Component{
 
  constructor(props){
    super(props);
    this.state = {
      connectionStatus: 'Connecting',
      stream: null,
      errorMessage: null
    }
  }

  componentDidMount(){
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
      debug:true,
      setRemoteSource: (source) => {this.setState({stream: source})},
      callback : function(info, description) {
        console.log('Staus:', info);
        if (info == "initialized") {
          console.log("initialized");
        } else if (info == "publish_started") {
          //stream is being published
          console.log("publish started");
          //startAnimation();
        } else if (info == "publish_finished") {
          //stream is being finished
          console.log("publish finished");
        }
        else if (info == "closed") {
          //console.log("Connection closed");
          if (typeof description != "undefined") {
            console.log("Connecton closed: " + JSON.stringify(description));
          }
        }
      },
      callbackError : function(error, message) {
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

    this.webRtcAdaptor.initialize()
    .then(() => {
      this.webRtcAdaptor.publish('stream1', null);
    })
    .catch((e) => {
      this.setState({ errorMessage: e.message });
    })
  }
  _endCall(){
     InCallManager.stop();
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
       if(this.props.hasError){
          return <ScreenLoader message='Error connecting. Try again.' goBack={() => {this._endCall() }}/>
        }

        if(this.state.connectionStatus != 'connected'){
          return <TouchableHighlight style={{paddingTop: 20}} onPress={() => {	this.webRtcAdaptor.publish('stream1', null); }}><Text>Start</Text></TouchableHighlight>
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
  sendMessage: PropTypes.func.isRequired,
  network: PropTypes.object.isRequired,
  publishEvent: PropTypes.func.isRequired,
  iceCandidates: PropTypes.array.isRequired,
  sdpAnswer: PropTypes.object.isRequired,
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