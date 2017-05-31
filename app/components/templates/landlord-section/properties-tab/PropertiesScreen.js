import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';

import {
  View,
  Button
} from 'react-native';

import {
  TwilioRemotePreview, 
  TwilioVideoPreview, 
  TwilioVideo
} from 'react-native-twilio-video-webrtc';

class PropertiesScreen extends Component {

  state = {
  }

  startCall = ({roomName, accessToken}) => {
    this.refs.twilioVideo.startCall({roomName, accessToken})
  }

  endCall = () => {
    this.refs.twilioVideo.endCall()
  }

  _onConnectButtonPress = () => {
    const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzdlNzQzMTk2NjEyZTRmN2Y3NTkwNWM4NjYwZGUyODA4LTE0OTYxODMxNzgiLCJpc3MiOiJTSzdlNzQzMTk2NjEyZTRmN2Y3NTkwNWM4NjYwZGUyODA4Iiwic3ViIjoiQUNmYmUxM2NhODRiNDE0NDU3NWU3MzdlNjFlMjhhZDMxMiIsImV4cCI6MTQ5NjE4Njc3OCwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiQ2xpZW50QXBwIiwidmlkZW8iOnsicm9vbSI6IlZpZXdpbmcxIn19fQ.Dsfg-OlAr4NGQk2B335c4PuShz0tBCaS3Gpy_x7fPqg';
    const roomName = 'Viewing1'
    this.startCall({roomName: roomName, accessToken: accessToken})
    // Note: You get TWILIO_ACCESS_TOKEN_HERE from your server probably
  }

  _onDisconnectButtonPress = () => {
    this.endCall()
  }


  render() {
    return (
      <View style={{ flex: 1 }}>

         <TwilioVideo
          ref="twilioVideo" 
          onRoomDidConnect={(data)=> {
            // ... participants = data["participantsNames"]
          }} 
          onRoomParticipantDidConnect={(data)=> {
            //... i.e. participant = data["participantName"]
          }} 
          onRoomParticipantDidDisconnec={(data) => {
            //...
          }}
          onRoomDidDisconnect={(data) => {
            //...
          }}
          onParticipantAddedVideoTrack={(data) => {
            //...
          }}
        />

        <TwilioVideoPreview style={{flex: 1, backgroundColor: '#FFFF00'}} />

        <TwilioRemotePreview style={{flex: 1, backgroundColor: '#FF00FF'}} />

        <Button
          style={{fontSize: 20, padding: 10, color: 'green'}}
          onPress={this._onConnectButtonPress} title='Click here'>
          Connect
        </Button>

        <Button
          style={{fontSize: 20, padding: 10, color: 'red'}}
          onPress={this._onDisconnectButtonPress} title='Click here2'>
          Disconnect
        </Button>

      </View>
    );
  }
}


const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesScreen);
