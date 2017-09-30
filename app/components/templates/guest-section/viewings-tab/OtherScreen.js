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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  
});

class OtherScreen extends Component{

  componentWillMount(){
    this.props.getViewing(this.props.navigation.state.params.viewing.id);
  }

  render(){
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
  title: `Room - ${navigation.state.params.viewing.property.name}`,
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

export default connect(mapStateToProps, mapDispatchToProps)(OtherScreen);
