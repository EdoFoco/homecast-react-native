import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

import { 
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  AsyncStorage,
  TextInput,
  ListView,
  ListViewDataSource,
  Text } from 'react-native';

 import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack
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
    width: 400,
    height: 400
  }
});

var webRtcPeer;
var pc;
var video = {};
var iceCandidates = [];
var remoteDescriptionSet = false;

class WebRTCChat extends Component{
 
  componentWillMount(){
    this.props.connect({ roomId: this.props.webrtc.roomId, username: 'edo', isPresenter: this.props.webrtc.isPresenter });
    this._startWebRtcAsViewer();
    
    /*webRtcPeer.onaddstream(function (event) {
      var x = event.stream.toURL();
    };*/
  }

  componentWillUnmount(){
    this.props.disconnect({ roomId: this.props.webrtc.roomId });
  }

  componentDidUpdate(){
    
   //console.log(webRtcPeer.getRemoteSessionDescriptor());
    var self = this;
    if(this.props.webrtc.viewer.sdpAnswer && !remoteDescriptionSet){
      const sessionDescription = {
        type: 'answer',
        sdp: this.props.webrtc.viewer.sdpAnswer
    };

    pc.setRemoteDescription(new RTCSessionDescription(sessionDescription), () => {
        // After receiving the SDP we add again the ice candidates, in case they were forgotten (bug)
       // pc = new RTCPeerConnection();
        remoteDescriptionSet = true;
        iceCandidates.forEach((iceCandidate) => {
            pc.addIceCandidate(iceCandidate);
        });

        console.log(pc.getRemoteStreams()[0].toURL());
        self.props.updateStreamUrl(pc.getRemoteStreams()[0].toURL());

    }, function(error){
      console.log(error);
    });
    }

    

    if(this.props.webrtc.viewer.isProcessingAnswer){
      //this.props.setViewerReadyToStream();
     /*   webRtcPeer.peerConnection.onaddstream = function (event) {
          self.props.updateStreamUrl(event.stream.toURL());
        };

      webRtcPeer.processAnswer(this.props.webrtc.viewer.sdpAnswer, this.props.setViewerReadyToStream);
    */
    }
    if(this.props.webrtc.viewer.isReady){
      var x = webRtcPeer.getRemoteStream();
      console.log(webRtcPeer.peerConnection);
      var stream = webRtcPeer.peerConnection.getRemoteStreams()[0];
      console.log(stream.toURL());

  
       this.props.updateStreamUrl(stream.toURL());

      //pc.addStream(x._tracks[0]);
      //pc.addStream(x._tracks[1]);
      //pc.addTrack(x);
      //ar streams = pc.getRemoteStreams()[0];
      /*for(var i = 0; i < this.props.webrtc.viewer.iceCandidates.length; i++){
        pc.addIceCandidate(this.props.webrtc.viewer.iceCandidates[i]);
      }*/
     
    }
    
  }

 _startWebRtcAsViewer  = function(){

    var self = this;

    if (!webRtcPeer) {
      
      var options = {
       // remoteVideo: video,
        onicecandidate : function(candidate){
          self._onIceCandidate(candidate);
        },
        onSdpAnswer: function(answer){
          self._onSdpAnswer(answer);
        }
      }

      pc = new RTCPeerConnection();
      
      pc.onicecandidate = function (event) {
        //console.log('onicecandidate', event.candidate);
        if(event.candidate != null){
          iceCandidates.push(event.candidate);
          pc.addIceCandidate(event.candidate);
        }
        if (event.candidate) {
          self.props.sendOnIceCandidate({roomId: self.props.webrtc.roomId, candidate: event.candidate});
        }
      };

      pc.createOffer(function(sdpOffer) {
        pc.setLocalDescription(sdpOffer, function () {
          self.props.startViewer({roomId: self.props.webrtc.roomId, sdpOffer: sdpOffer.sdp});
        });
      });
      
       pc.onaddstream = function (event) {
          console.log('adding stream');
          console.log(event.stream.toURL());
          //self.props.updateStreamUrl(event.stream.toURL());
          
       };

       pc.onsdpanswer = function(answer){
         console.log(answer);
       }
/*
      webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function(error) {
        if(error) return onError(error);

        this.peerConnection.onsdpanswer = function(answer){
          self._onSdpAnswer(answer);
        }

        this.generateOffer(function(error, sdpOffer){
          self._onOfferViewer(error, sdpOffer)
        });
      });*/

      
    }
 }

 _onSdpAnswer = function(answer){
  //if(this.props.webrtc.viewer.sdpAnswer && !remoteDescriptionSet){
      console.log(webRtcPeer.peerConnection.iceConnectionState);
      webRtcPeer.peerConnection.setRemoteDescription(new RTCSessionDescription({ sdp: answer, type: "answer" }), function () {
        console.log('remote description set');
        iceCandidates.forEach((iceCandidate) => {
            webRtcPeer.peerConnection.addIceCandidate(iceCandidate);
        });
        remoteDescriptionSet = true;
        
      /*if (pc.remoteDescription.type == "offer")
        pc.createAnswer(function(desc) {
          //console.log('createAnswer', desc);
          pc.setLocalDescription(desc, function () {
            console.log('setLocalDescription', pc.localDescription);
          //  socket.emit('exchange', {'to': fromId, 'sdp': pc.localDescription });
          }, function(error){
            console.log(error);
          });
        }, function(error){
            console.log(error);
          });*/
      }, function(error){
        console.log(error);
      });
    //}
 }

_onIceCandidate = function(candidate){
     console.log('Local candidate' + JSON.stringify(candidate));
     iceCandidates.push(candidate);
     this.props.sendOnIceCandidate({roomId: this.props.webrtc.roomId, candidate: candidate});
    // this.props.setViewerReadyToStream();
}

_onOfferViewer = function(error, sdpOffer){
    //if (error) return onError(error)

    console.log('Send SdpMessage');
    this.props.startViewer({roomId: this.props.webrtc.roomId, sdpOffer: sdpOffer});
}

_renderRow = function(rowData, rowId){
   return (
     <View style={{flexWrap: 'wrap', backgroundColor: 'rgba(34, 167, 240, 0.6)', borderRadius:10, margin:10, padding:10}}>
      <Text style={{flex: 1, color:'white', fontWeight:'bold'}}>{rowData.username}</Text>
      <Text style={{flex: 1, color:'white'}}>{rowData.message}</Text>
    </View>
    )
 }

  _messageTextChanged = function(text){
    if(text){
      this.props.userIsTyping({ roomId: this.props.webrtc.roomId, currentMessage: text, userIsTyping: true, username: this.props.user.user.name } );
      this.props.chatTextChanged( { currentMessage: text, userIsTyping: true, username: this.props.user.user.name } );
    }
    else{
      this.props.userIsTyping({ roomId: this.props.webrtc.roomId, currentMessage: '', userIsTyping: false, username: this.props.user.user.name } );
      this.props.chatTextChanged( { currentMessage: '', userIsTyping: false, username: this.props.user.user.name } );
    }

  }

  _sendMessage = function(){
    console.log('sending message:' + this.props.currentMessage);
    this.props.message({ roomId: this.props.webrtc.roomId, username: this.props.user.user.name, message: this.props.currentMessage });
    this.props.chatTextChanged( { currentMessage: '', userIsTyping: false, username: this.props.user.user.name } );
    this.props.userIsTyping({ roomId: this.props.webrtc.roomId, currentMessage: '', userIsTyping: false, username: this.props.user.user.name } );
    this.refs.message.clear();
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
       if(this.props.webrtc.viewer.streamUrl !== 'undefined'){
          return(  <RTCView streamURL={this.props.webrtc.viewer.streamUrl} style={styles.remoteView}/> )
       }
       
        return (
          <View style={styles.chatContainer}>
             <TouchableHighlight
                  onPress={this._setIsPresenter.bind(this)}
                  style={{width:200, justifyContent: 'center', backgroundColor: 'blue', margin: 5, borderRadius:10}}>
                  <Text style={{textAlign: 'center', justifyContent: 'center', color:'white'}}>Set Presenter</Text>
              </TouchableHighlight>
            <View style={styles.listViewContainer}>
              <ListView
                renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                dataSource={this.props.chatMessages}
                renderRow={(rowData, rowId) => this._renderRow(rowData, rowId)} 
                />
              </View>
              <View style={styles.chatInputGroup}>
                <TextInput
                  ref='message'
                  autoCorrect={false}
                  style={{flex:3, height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(text) => this._messageTextChanged(text)}
                  value={this.props.currentMessage}
                />
                <TouchableHighlight
                  onPress={this._sendMessage.bind(this)}
                  style={{flex:1, justifyContent: 'center', backgroundColor: 'blue', margin: 5, borderRadius:10}}>
                  <Text style={{textAlign: 'center', justifyContent: 'center', color:'white'}}>Send</Text>
              </TouchableHighlight>
              </View>
                { ((this.props.webrtc.usersTyping.indexOf(this.props.user.user.name) > -1 && this.props.webrtc.usersTyping.length > 1) || (this.props.webrtc.usersTyping.indexOf(this.props.user.user.name) == -1 && this.props.webrtc.usersTyping.length > 0)) &&
                    <View><Text>Someone is typing</Text></View>
                }
           </View>
        );
  }
}

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});


const mapStateToProps = (state) => {
    console.log(state);
    //Re-order rows for inverted List View
    var rowIds = state.webrtc.chatMessages.map((row, index) => index).reverse();
    return {
        user: state.user,
        chatMessages: ds.cloneWithRows(state.webrtc.chatMessages, rowIds),
        currentMessage: state.webrtc.currentMessage,
        webrtc: state.webrtc
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WebRTCChat);
