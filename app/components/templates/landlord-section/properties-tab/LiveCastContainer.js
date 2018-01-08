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
            <AdminWebRTCChat />
          </View>
      );
    }
    else{
      return (<Text>Loading webrtc</Text>);
    }
  }
  
}

LiveCastContainer.navigationOptions = ({ navigation }) => ({
  title: `Room - ${navigation.state.params.viewing.id}`,
});


const mapStateToProps = ( state, navigation ) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        chat: state.chat
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveCastContainer);
