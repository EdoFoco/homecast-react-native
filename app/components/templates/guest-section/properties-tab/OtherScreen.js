import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import WebRTCChat from '../../../molecules/WebRTCChat';
import {
  StyleSheet,
  Text,
  View,
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
      return <View>
        <Text>Waiting for presenter...</Text>
      </View>
    }

    if(this.props.chat.roomId){
      return(
          <View style={styles.container}>
            <WebRTCChat />
          </View>
      );
    }
    else{
      return (<Text>Loading webrtc</Text>);
    }
  }
  
}

OtherScreen.navigationOptions = ({ navigation }) => ({
  title: `Room - ${navigation.state.params.viewing.id}`,
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
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  
});