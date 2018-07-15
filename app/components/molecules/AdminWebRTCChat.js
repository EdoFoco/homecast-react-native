import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chat from './Chat';
import * as Colors from '../helpers/ColorPallette';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as FontSizes from '../helpers/FontSizes';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import kurentoUtils from '../../libs/third-party/kurento';
import InCallManager from 'react-native-incall-manager';
import ScreenLoader from '../molecules/ScreenLoader';

import { 
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableHighlight,
  Platform} from 'react-native';

 import {
  RTCIceCandidate,
  RTCView,
  MediaStreamTrack,
  getUserMedia} from 'react-native-webrtc';


var pc;
var iceCandidatesCount = 0;
var localStream;
var kurentoPeer;

export default class AdminWebRTCChat extends Component{
 
  constructor(props) {
    super(props);
    this.state = { 
        sdpAnswerLoaded: false,
        isMicrophoneMute: false,
        streamUrl: null
     };
  }

  componentWillMount(){
    console.log('About to connect!!');
    
    var self = this;

    this._getLocalStream(true, function(stream) {
        localStream = stream;
        var options = {
            videoStream: localStream,
            onicecandidate : function (event) {
                console.log('onicecandidate', event.candidate);
                if (event.candidate) {
                  console.log("3. Presenter - Sending Ice Cnadidate")
                  self.props.publishEvent({type: 'onIceCandidate', data: { roomId: self.props.chat.roomId, candidate: event }});
                }
            }
        }

        kurentoPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error) {
          if(error) return onError(error);

          console.log('1. Presenter - Generating offer');
          this.generateOffer(function(error, offer){
              console.log('2. Presenter - Offer generated')
              self.props.publishEvent({type: 'presenter', data: {roomId: self.props.chat.roomId, sdpOffer: offer}});
              self._startWebRtcAsPresenter();
         });
        });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.iceCandidates.length > prevProps.iceCandidates.length) {
      console.log("6. Adding Ice Candidate")
      var candidate = this.props.iceCandidates[this.props.iceCandidates.length -1];
      if(pc && candidate) pc.addIceCandidate(new RTCIceCandidate(candidate));
    }

    if(this.props.sdpAnswer){
      if(!this.state.sdpAnswerLoaded){
       // console.log('5. Presenter - Processing Presenter Answer');
        this.setState({sdpAnswerLoaded: true});
        kurentoPeer.processAnswer(this.props.sdpAnswer, function(){
          console.log('Presenter initialised.');
        });
      }
    }
  }

  componentWillUpdate(){
    
    // if(this.props.webrtc.presenter.iceCandidates.length > 0){
    //   iceCandidatesCount = this.props.webrtc.presenter.iceCandidates.length;
    //   //console.log("4. Presenter - Adding Ice Candidate")
    //   pc.addIceCandidate(new RTCIceCandidate(this.props.webrtc.presenter.iceCandidates[iceCandidatesCount -1]));
    // }

    // if(this.props.webrtc.presenter.sdpAnswer){
    //     if(!this.state.sdpAnswerLoaded){
    //         console.log('5. Presenter - Processing Presenter Answer');
    //         kurentoPeer.processAnswer(this.props.webrtc.presenter.sdpAnswer, function(){
    //           console.log('hi presenter');
    //         });
    //         this.setState({sdpAnswerLoaded: true});
    //     }
    //   }
  }

  componentWillUnmount(){
    localStream.getTracks().forEach(t => t.stop());
    localStream.release();
    this.props.goBack();
    iceCandidatesCount = 0;
    kurentoPeer.dispose();
    pc = null;
  }

  _getLocalStream(isFront, callback) {
    if (Platform.OS === 'ios') {
      MediaStreamTrack.getSources(sourceInfos => {
        console.log("sourceInfos: ", sourceInfos);
  
        for (const i = 0; i < sourceInfos.length; i++) {
          const sourceInfo = sourceInfos[i];
          if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
            videoSourceId = sourceInfo.id;
          }
        }
      });
    }

    var mediaOptions = this._getMediaOptions();
    
    getUserMedia(mediaOptions, function (stream) {
      console.log('getUserMedia success', stream);
      callback(stream);
    }, function(error){
      console.log(error)
    });
}

_getMediaOptions(){
  if(!this.props.network){
    return {
      audio: true,
      video: {
        mandatory: {
          width: { min: 480, ideal: 720, max: 1080 },
          height: { min: 640, ideal: 1280, max: 1920 },
          minFrameRate: 30
        }
      }
    }
  }

  if(this.props.network.networkType == 'wifi' || this.props.network.signalStrength == '4g'){
    console.log('Stream in high quality')
    return {
      audio: true,
      video: {
        mandatory: {
          width: { min: 480, ideal: 720, max: 1080 },
          height: { min: 640, ideal: 1280, max: 1920 },
          minFrameRate: 30
        }
      }
    }
  }
  else{
    console.log('Stream in low quality')
    return {
      audio: true,
      video: {
        mandatory: {
          width: { min: 240, ideal: 480, max: 720 },
          height: { min: 320, ideal: 640, max: 960 },
          minFrameRate: 25
        }
      }
    }
  }
  /*
  {
      audio: true,
      video: {
        mandatory: {
          width: { min: 320, ideal: 640, max: 960 },
          height: { min: 240, ideal: 480, max: 720 },
          minFrameRate: 25
        }
      }
    }*/ 
}

 _startWebRtcAsPresenter  = function(){

      var self = this;
      pc = kurentoPeer.peerConnection;

      pc.onnegotiationneeded = function () {
        console.log('onnegotiationneeded');
       // if (isOffer) {
          console.log("2. Negotiation needed, lets create an offer.")

          //createOffer();
       // }
      }

      pc.oniceconnectionstatechange = function(event) {
            console.log("7. Ice Connection State Changed - get stats")

          console.log('oniceconnectionstatechange', event.target.iceConnectionState);
          if (event.target.iceConnectionState === 'completed') {
            InCallManager.start();
            InCallManager.setKeepScreenOn(true);
            // setTimeout(() => {
            //   //getStats();
            // }, 1000);
          }
          if (event.target.iceConnectionState === 'connected') {
            console.log('Connected!!!');
          }
      };
    
      self.setState({streamUrl: localStream.toURL()});
      pc.addStream(localStream);
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

        return (
          <RTCView streamURL={this.state.streamUrl} style={styles.remoteView}  objectFit ='cover'>
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