import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import ChatScreen from '../../shared/ChatScreen';

import {
  StyleSheet,
  View
} from 'react-native';


class ChatContainer extends Component{

  render() {
    return (
      <View style={styles.container}>
        <ChatScreen 
            user={this.props.user} 
            chat={this.props.chat} 
            getMessages={this.props.getMessages}
            sendMessage={this.props.sendMessage}
        />
      </View>
    )
  }
  
}

ChatContainer.navigationOptions = {
  title: 'Chat',
};

const mapStateToProps = (state, {navigation}) => {
    console.log(navigation.state.params);
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