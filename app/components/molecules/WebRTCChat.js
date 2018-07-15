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

 import {
  RTCIceCandidate,
  RTCView,
} from 'react-native-webrtc';

var pc;
var iceCandidatesCount = 0;
var kurentoPeer;
var counter = 0;

export default class WebRTCChat extends Component{
 
  constructor(props) {
    super(props);
    this.state = { 
        sdpAnswerLoaded: false,
        isAudioMute: false,
        connectionStatus: 'Connecting',
        streamUrl: null
     };
  }
  
  componentWillMount(){
    var self = this;
    
    var kurentoOptions = {
          onicecandidate: function (event) {
            console.log('onicecandidate', event.candidate);
            if (event.candidate) {
              console.log("5. Ice Candidate Received")
              self.props.publishEvent({type: 'onIceCandidate', data: { roomId: self.props.chat.roomId, candidate: event }});
              //self.props.sendOnIceCandidate({roomId: self.props.chat.roomId, candidate: event});
            }
          }
      }

    kurentoPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(kurentoOptions, function(error) {
			if(error) return onError(error);

			console.log('Viewer about to generate offer');
			this.generateOffer(function(error, offer){
          console.log(error);
          self.props.publishEvent({type: 'viewer', data: {roomId: self.props.chat.roomId, sdpOffer: offer}});
         // self.props.startViewer({roomId: self.props.chat.roomId, sdpOffer: offer});
          self._startWebRtcAsViewer();   
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.iceCandidates.length > prevProps.iceCandidates.length) {
      iceCandidatesCount = this.props.webrtc.viewer.iceCandidates.length;
      console.log("6. Adding Ice Candidate")
      console.log(counter);
      counter++;
      var candidate = this.props.iceCandidates[this.props.iceCandidates.length -1];
      console.log('length:' + this.props.iceCandidates.length + 'candiate: ' + candidate.candidate);
      if(pc && candidate) pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }
  componentWillUpdate(){
    // if(this.props.webrtc.viewer.iceCandidates.length > iceCandidatesCount){
    //   iceCandidatesCount = this.props.webrtc.viewer.iceCandidates.length;
    //   console.log("6. Adding Ice Candidate")
    //   console.log(counter);
    //   counter++;
    //   if(pc) pc.addIceCandidate(new RTCIceCandidate(this.props.webrtc.viewer.iceCandidates[iceCandidatesCount -1]));
    // }

    // if(this.props.webrtc.viewer.sdpAnswer){
    //   if(!this.state.sdpAnswerLoaded){
    //    // console.log('5. Presenter - Processing Presenter Answer');
    //     this.setState({sdpAnswerLoaded: true});
    //     kurentoPeer.processAnswer(this.props.webrtc.viewer.sdpAnswer, function(){
    //       console.log('hi viewer');
    //     });
    // }
    // }
  }

  componentWillUnmount(){
    iceCandidatesCount = 0;
    kurentoPeer.dispose();
    pc = null;
    counter = 0;
  }

 _startWebRtcAsViewer  = function(){

      var self = this;
      pc = kurentoPeer.peerConnection;
      console.log("1. Creating Peer Connection.")
      

      pc.onnegotiationneeded = function () {
        console.log('onnegotiationneeded');
        console.log("2. Negotiation needed, lets create an offer.")
      }

      pc.oniceconnectionstatechange = function(event) {
          console.log("7. Ice Connection State Changed - get stats")

          console.log('oniceconnectionstatechange', event.target.iceConnectionState);

          //self.props.updateConnectionStatus(event.target.iceConnectionState);
          self.setState({connectionStatus: event.target.iceConnectionState});

          if(event.target.iceConnectionState == 'completed'){
            InCallManager.start(); // audio/video, default: audio
            InCallManager.setForceSpeakerphoneOn(true);
            InCallManager.setKeepScreenOn(true);
          }
      };
      
      pc.onaddstream = function (event) {
          self.setState({streamUrl: event.stream.toURL()});
          //self.props.updateStreamUrl(event.stream.toURL());
          console.log("8. Stream has been added");

          console.log('onaddstream', event.stream);
          console.log(event.stream.toURL());
       
       };

       function getStats() {
          if(pc){
            console.log(pc.iceConnectionState);
          } 
      }

      setTimeout(() => {
        getStats();
      }, 100);
  }

  _endCall(){
    InCallManager.stop();
    this.props.goBack();
  }

  _setAudioMute(){
    this.setState({ isAudioMute: !this.state.isAudioMute }, () => {
     // InCallManager.setMicrophoneMute(this.state.isMicrophoneMute);
    });
  }

  render() {
    
       if(this.props.webrtc.hasError){
          return <View>
            <Text>There was an error connecting to the socket. Go Back and try again</Text>
          </View>
        }
        
        if(this.state.connectionStatus != 'completed'){
          return <ScreenLoader message={this.state.connectionStatus } goBack={() => {this.props.goBack() }}/>
        }

        return (
          <RTCView streamURL={this.state.streamUrl} style={styles.remoteView}  objectFit ='cover'>
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
  webrtc: PropTypes.object.isRequired,
  sendMessage: PropTypes.func.isRequired,
  connect: PropTypes.func.isRequired,
  disconnect: PropTypes.func.isRequired,
  sendOnIceCandidate: PropTypes.func.isRequired,
  startViewer: PropTypes.func.isRequired,
  updateStreamUrl: PropTypes.func.isRequired,
  updateConnectionStatus: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  publishEvent: PropTypes.func.isRequired,
  iceCandidates: PropTypes.array.isRequired
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