import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chat from './Chat';
import * as Colors from '../helpers/ColorPallette';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenLoader from '../molecules/ScreenLoader';
import InCallManager from 'react-native-incall-manager';
import kurentoUtils from '../../libs/third-party/kurento';
import { 
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Text} from 'react-native';

 import { RTCView } from 'react-native-webrtc';
 import WebRtcAdaptor from '../../libs/third-party/AntMedia/WebRtcAdaptor';

export default class WebRTCChat extends Component{
 
  webRTCAdaptor = null;

  constructor(props) {
    super(props);
    this.state = { 
        sdpAnswerLoaded: false,
        isAudioMute: false,
        connectionStatus: 'Connecting',
        stream: null
     };
  }

  componentDidMount(){
    var pc_config = null;

    var sdpConstraints = {
      OfferToReceiveAudio : true,
      OfferToReceiveVideo : true

    };

    var mediaConstraints = {
      video : false,
      audio : false
	  };

    console.log('Initliazing webrtc');
    this.webRTCAdaptor = new WebRtcAdaptor({
      mediaConstraints : mediaConstraints,
      peerconnection_config : pc_config,
      sdp_constraints : sdpConstraints,
      isPlayMode : true,
      debug : true,
      remoteStream: this.state.stream,
      setRemoteSource: (source) => {this.setState({stream: source})},
      callback : (info, description) => {
        if (info == "initialized") {
          console.log("initialized");
          this.setState({connectionStatus: 'initialized'});
         } else if (info == "play_started") {
          //joined the stream
          console.log("play started");
          this.setState({connectionStatus: 'play started'});
        // } else if (info == "newStreamAvailable"){
        //   console.log('New stream found');
        //  // this.setState({stream: description});
        } else if (info == "play_finished") {
          //leaved the stream
          console.log("play finished");
          this.setState({connectionStatus: 'play finished'});
        } else if (info == "closed") {
          //console.log("Connection closed");
          if (typeof description != "undefined") {
            console.log("Connecton closed: "
                + JSON.stringify(description));
          }
          this.setState({connectionStatus: 'disconnected'});
        }
      },
      callbackError : (error) => {
        //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
  
        console.log("error callback: " + JSON.stringify(error));
        this.setState({hasError: true});
      }
    });

    this.webRTCAdaptor.initialize();

  }

  start(){
    this.webRTCAdaptor.play('stream1', null);
  }
  
  render() {
    if(this.props.hasError){
      return <ScreenLoader message='Error connecting. Try again.' goBack={() => {this.props.goBack() }}/>
    }

    if(this.state.connectionStatus != 'play started' || !this.state.stream){
      return <View>
        <TouchableHighlight onPress={() => {this.start()}}><Text>Play</Text></TouchableHighlight>
      </View>
     // return <ScreenLoader message={this.state.connectionStatus } goBack={() => {this.props.goBack() }}/>
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
  hasError: PropTypes.bool.isRequired
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