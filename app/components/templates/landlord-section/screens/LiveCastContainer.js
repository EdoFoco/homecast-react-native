import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import SocketIoService from '../../../../libs/services/SocketIoService';
import AdminWebRTCChat from '../../../molecules/AdminWebRTCChat';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

class LiveCastContainer extends Component{

  constructor(props){
    super(props);
    this.state = {
      socketId: null,
      roomStatus: {},
      iceCandidates: [],
      presenterResponse: {
        sdpAnswer: null
      },
      webRtcError: false
    }
  }

  componentWillMount(){
    this.props.getViewing(this.props.navigation.state.params.viewing.id)
    .then((resp) => {
      return this.props.updateRoomId(resp.id);
    });
  }

  goBack(){
    this.props.navigation.goBack();
  }

  render(){
    //if(this.props.chat.roomId && this.state.socketId){
      return(
          <View style={styles.container}>
            <AdminWebRTCChat 
              user={this.props.user} 
              chat={this.props.chat}
              viewing={this.props.navigation.state.params.viewing}
              sendMessage={(roomId, username, message) => { this.props.message(roomId, username, message)}}
              network={this.props.network}
              hasError={this.state.webRtcError}
              goBack={() => {this.goBack()}}
              />
          </View>
      );
    }
    // else{
    //   return (<TouchableHighlight style={{marginTop: 150}}onPress={() => {this.goBack()}}><Text>Loading webrtc</Text></TouchableHighlight>);
    // }
  //}
  
}

LiveCastContainer.navigationOptions = ({ navigation }) => ({
  header: null
});

const mapStateToProps = ( state, navigation ) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        chat: state.chat,
        network: state.network
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveCastContainer);


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  
});