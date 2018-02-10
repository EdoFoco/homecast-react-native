import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import WebRTCChat from '../../../molecules/WebRTCChat';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenLoader from '../../../molecules/ScreenLoader';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions
} from 'react-native';

class OtherScreen extends Component{

  componentWillMount(){
    this.props.getViewing(this.props.navigation.state.params.viewing.id)
    .then((resp) => {
      console.log('room id is: ' + resp.id);
      return this.props.updateRoomId(resp.id);
    })
    .then(() => {
      console.log('About to connect!!');
      this.props.connect({ roomId: this.props.chat.roomId, username: 'edo', isPresenter: false });
    });
  }

  componentWillUnmount(){
    this.props.disconnect({ roomId: this.props.chat.roomId });
  }

  render(){
    if(!this.props.webrtc.roomStatus.presenterConnected){
      return(
        <ScreenLoader message={'WAITING FOR PRESENTER'} goBack={() => {this.props.navigation.goBack() }} />
      )
    }

    if(this.props.chat.roomId){
      return(
          <View style={styles.container}>
              <WebRTCChat style={{backgroundColor: 'green}', alignSelf: 'stretch'}}
                user={this.props.user} 
                chat={this.props.chat}
                webrtc={this.props.webrtc}
                connect={(data) => {this.props.connect(data)}}
                disconnect={(data) => {this.props.disconnect(data)}}
                sendMessage={(roomId, username, message) => { this.props.message(roomId, username, message)}}
                startViewer={(data) => {this.props.startViewer(data)}}
                sendOnIceCandidate={(data) => {this.props.sendOnIceCandidate(data)}}
                updateStreamUrl={(data) => {this.props.updateStreamUrl(data)}}
                updateConnectionStatus={(data) => {this.props.updateConnectionStatus(data)}}
                navigation={this.props.navigation}
              />
          </View>
      );
    }
    else{
      return (<Text>Loading webrtc</Text>);
    }
  }
  
}

OtherScreen.navigationOptions = ({ navigation }) => ({
    header: null
});



const mapStateToProps = ( state, navigation ) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        chat: state.chat,
        webrtc: state.webrtc
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OtherScreen);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    //width: Dimensions.get('window').width,
    //justifyContent: 'center',
   // alignItems: 'center',
    backgroundColor: 'blue',
  }
});