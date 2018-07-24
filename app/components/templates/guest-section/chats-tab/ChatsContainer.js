import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import * as Colors from '../../../helpers/ColorPallette';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import ChatsScreen from '../../shared/ChatsScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  StyleSheet,
  View,
  FlatList,
  Text
} from 'react-native';

class ChatsContainer extends Component{

  componentWillMount(){
      this.props.getChats()
      .then((chats) => {
          //DoSomething
      });
  }

  _goToChatScreen(chat){
    this.props.goToChat(chat);
    this.props.navigation.navigate('ChatsStack');
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={{height: 25, backgroundColor: Colors.DARK_BLUE}}></View>
          <ChatsScreen chats={this.props.chats} user={this.props.user} goToScreen={(chat) => {this._goToChatScreen(chat)}} getChats={this.props.getChats} >Chat</ChatsScreen>
          <NetworkErrorMessage isVisible={this.props.network.hasError} showError={(show) => {this.props.showNetworkError(show)}} />
      </View>
    )
  }
  
}

ChatsContainer.navigationOptions = {
  tabBarLabel: 'Chats',
  tabBarIcon: ({ tintColor }) => (
      <Icon name="message-outline"  size={24} color={tintColor} style={{height: 24, width: 24}} />
    ),
};

const mapStateToProps = (state) => {
    
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        network: state.network,
        chats: state.chat.chats
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatsContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});