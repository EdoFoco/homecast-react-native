import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';
import Chat from './Chat';

import { 
  View,
  StyleSheet,
  Dimensions,
  Text} from 'react-native';

 import {
  RTCPeerConnection,
  RTCMediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';

import kurentoUtils from 'react-native-kurento-utils-js';


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
  }
});

var pc;
var iceCandidatesCount = 0;
var localStream;
var kurentoPeer;

class WebRTCChat extends Component{
 
  componentWillMount(){
    /*this._getLocalStream(true, function(stream) {
          localStream = stream;
          self._startWebRtcAsViewer();
    });*/

    var self = this;
    
    var kurentoOptions = {
          onicecandidate: function (event, error) {
            console.log('onicecandidate', event.candidate);
            if (event.candidate) {
              console.log("5. Ice Candidate Received")
              self.props.sendOnIceCandidate({roomId: self.props.chat.roomId, candidate: event});
            }
          }
      }

    kurentoPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(kurentoOptions, function(error) {
			if(error) return onError(error);

			console.log('Viewer about to generate offer');
			this.generateOffer(function(error, offer){
          self.props.startViewer({roomId: self.props.chat.roomId, sdpOffer: offer});
          self._startWebRtcAsViewer();
      });
		});
  }

  componentWillUpdate(){
    
    if(this.props.webrtc.viewer.iceCandidates.length > iceCandidatesCount){
      iceCandidatesCount = this.props.webrtc.viewer.iceCandidates.length;
      console.log("6. Adding Ice Candidate")
      pc.addIceCandidate(new RTCIceCandidate(this.props.webrtc.viewer.iceCandidates[iceCandidatesCount -1]));
    }

    if(this.props.webrtc.viewer.sdpAnswer){
      	kurentoPeer.processAnswer(this.props.webrtc.viewer.sdpAnswer, function(){
			    console.log('hi');
		    });
    }
  }

  _getLocalStream(isFront, callback) {

  let videoSourceId;

  // on android, you don't have to specify sourceId manually, just use facingMode
  // uncomment it if you want to specify
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
  getUserMedia({
    audio: true,
    video: false,
  }, function (stream) {
    console.log('getUserMedia success', stream);
    callback(stream);
  }, function(error){console.log(error)});
}

 _startWebRtcAsViewer  = function(){

      var self = this;
      pc = kurentoPeer.peerConnection;
      console.log("1. Creating Peer Connection.")
      
      function logError(error){
        console.log(error);
      }

      /*pc.onicecandidate = function (event) {
        console.log('onicecandidate', event.candidate);
        if (event.candidate) {
          console.log("5. Ice Candidate Received")
          self.props.sendOnIceCandidate({roomId: self.props.chat.roomId, candidate: candidate});
        }
      };*/

      /*function createOffer() {
        pc.createOffer(function(desc) {
          console.log("3. Creating Offer.")
          console.log('createOffer', desc);
          pc.setLocalDescription(desc, function () {
          console.log("4. Setting local description.")
            console.log('setLocalDescription', pc.localDescription);
            self.props.startViewer({roomId: self.props.chat.roomId, sdpOffer: pc.localDescription.sdp});
          }, logError);
        }, logError);
      }*/

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
            setTimeout(() => {
              //getStats();
            }, 1000);
          }
          if (event.target.iceConnectionState === 'connected') {
            //createDataChannel();
          }
      };
      
      pc.onaddstream = function (event) {
          self.props.updateStreamUrl(event.stream.toURL());
        console.log("8. Stream has been added");

        console.log('onaddstream', event.stream);
        console.log(event.stream.toURL());
       };

       //pc.addStream(localStream);
 }

  _setIsPresenter = function(){
    this.props.setIsPresenter(true);
  }

  render() {
       if(this.props.webrtc.hasError){
          return <View>
            <Text>There was an error connecting to the socket. Go Back and try again</Text>
          </View>
        }

        return (
          <RTCView streamURL={this.props.webrtc.viewer.streamUrl} style={styles.remoteView}  objectFit ='cover'>
            <Chat />
          </RTCView>
        );
  }
}


const mapStateToProps = (state) => {
    return {
        user: state.user,
        webrtc: state.webrtc,
        chat: state.chat
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WebRTCChat);
