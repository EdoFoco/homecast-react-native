import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import * as Colors from '../../../helpers/ColorPallette';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import ChatScreen from '../../shared/ChatScreen';

import {
  StyleSheet,
  View,
  FlatList,
  Text
} from 'react-native';


class ChatContainer extends Component{

  render() {
    return (
      <View style={styles.container}>
        <ChatScreen user={this.props.user} chat={this.props.chat} getMessages={this.props.getMessages}/>
      </View>
    )
  }
  
}

ChatContainer.navigationOptions = {
  title: 'Chat',
};

const mapStateToProps = (state, {navigation}) => {
    
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        network: state.network,
        chat: navigation.state.params.chat
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});