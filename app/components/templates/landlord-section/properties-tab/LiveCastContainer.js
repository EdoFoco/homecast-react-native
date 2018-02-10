import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import AdminWebRTCChat from '../../../molecules/AdminWebRTCChat';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  
});

class LiveCastContainer extends Component{

  componentWillMount(){
    this.props.getViewing(this.props.navigation.state.params.viewing.id)
    .then((resp) => {
      console.log('room id is: ' + resp.id);
      return this.props.updateRoomId(resp.id);
    });
  }

  render(){
    if(this.props.chat.roomId){
      return(
          <View style={styles.container}>
            <AdminWebRTCChat 
              user={this.props.user} 
              chat={this.props.chat}
              webrtc={this.props.webrtc}
              connect={(data) => {this.props.connect(data)}}
              disconnect={(data) => {this.props.disconnect(data)}}
              sendMessage={(roomId, username, message) => { this.props.message(roomId, username, message)}}
              startPresenter={(data) => {this.props.startPresenter(data)}}
              sendOnIceCandidate={(data) => {this.props.sendOnIceCandidate(data)}}
              updateStreamUrl={(data) => {this.props.updateStreamUrl(data)}}
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

LiveCastContainer.navigationOptions = ({ navigation }) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(LiveCastContainer);
