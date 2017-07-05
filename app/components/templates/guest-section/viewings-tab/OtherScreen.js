import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import WebRTCChat from '../../../molecules/NewWebRTCChat';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

class OtherScreen extends Component{

  render(){
    return(

        <View style={styles.container}>
          <WebRTCChat />
        </View>
    );
  }
  
}

OtherScreen.navigationOptions = {
  title: 'Other Screen',
};

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OtherScreen);
