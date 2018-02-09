import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';
import Chat from './Chat';

import { 
  View,
  StyleSheet,
  Dimensions,
  Text,
  Platform} from 'react-native';

 import {
  RTCPeerConnection,
  RTCMediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStreamTrack,
  getUserMedia,
  MediaStream
} from 'react-native-webrtc';

import kurentoUtils from 'react-native-kurento-utils-js';

var pc;
var iceCandidatesCount = 0;
var localStream;
var kurentoPeer;

class AdminWebRTCChat extends Component{
 
  constructor(props) {
    super(props);
    this.state = { 
        sdpAnswerLoaded: false
     };
  }

  componentWillMount(){
    console.log('About to connect!!');
    this.props.connect({ roomId: this.props.chat.roomId, username: 'edo', isPresenter: false });

    var self = this;

    this._getLocalStream(true, function(stream) {
        localStream = stream;
        var options = {
            videoStream: localStream,
            onicecandidate : function (event, error) {
                console.log('onicecandidate', event.candidate);
                if (event.candidate) {
                  console.log("3. Presenter - Sending Ice Cnadidate")
                  self.props.sendOnIceCandidate({roomId: self.props.chat.roomId, candidate: event});
                }
            }
        }

        kurentoPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error) {
          if(error) return onError(error);

          console.log('1. Presenter - Generating offer');
          this.generateOffer(function(error, offer){
              console.log('2. Presenter - Offer generated')
              self.props.startPresenter({roomId: self.props.chat.roomId, sdpOffer: offer});
              self._startWebRtcAsPresenter();
          });
        });
    });
  }

  componentWillUpdate(){
    
    if(this.props.webrtc.presenter.iceCandidates.length > 0){
      iceCandidatesCount = this.props.webrtc.presenter.iceCandidates.length;
      //console.log("4. Presenter - Adding Ice Candidate")
      pc.addIceCandidate(new RTCIceCandidate(this.props.webrtc.presenter.iceCandidates[iceCandidatesCount -1]));
    }

    if(this.props.webrtc.presenter.sdpAnswer){
        if(!this.state.sdpAnswerLoaded){
            console.log('5. Presenter - Processing Presenter Answer');
            kurentoPeer.processAnswer(this.props.webrtc.presenter.sdpAnswer, function(){
              console.log('hi presenter');
            });
            this.setState({sdpAnswerLoaded: true});
        }
      }
     
    // if(this.props.webrtc.viewer.sdpAnswer){
    //     console.log('6. Presenter - Processing Viewer Response');
    //     kurentoPeer.processAnswer(this.props.webrtc.presenter.sdpAnswer, function(){
    //       console.log('hi viewer');
    //     });
    //   }
  }

  componentWillUnmount(){
    localStream.getTracks().forEach(t => t.stop());
    localStream.release();
    this.props.disconnect({ roomId: this.props.chat.roomId });
    iceCandidatesCount = 0;
    kurentoPeer.dispose();
    pc = null;
  }

  _getLocalStream(isFront, callback) {

    let videoSourceId;

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
      video: {
        mandatory: {
          maxWidth: 800,
          maxFrameRate: 45,
          minFrameRate: 30
        }
      }
    }, function (stream) {
      console.log('getUserMedia success', stream);
      callback(stream);
    }, function(error){
      console.log(error)
    });
}

 _startWebRtcAsPresenter  = function(){

      var self = this;
      pc = kurentoPeer.peerConnection;
      //console.log("1. Creating Peer Connection.")
      
      function logError(error){
        console.log(error);
      }

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
            console.log('Connected!!!');
            //createDataChannel();
          }
      };
      
      // pc.onaddstream = function (event) {
      //     self.props.updateStreamUrl(event.stream.toURL());
      //       console.log("8. Stream has been added");

      //       console.log('onaddstream', event.stream);
      //       console.log(event.stream.toURL());
      //  };

      self.props.updateStreamUrl(localStream.toURL());

       pc.addStream(localStream);
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminWebRTCChat);



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