import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import * as Colors from '../../../helpers/ColorPallette';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import ChatsScreen from '../../shared/ChatsScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIndicator  } from 'react-native-indicators';
import ErrorScreen from '../../shared/ErrorScreen';
import {
  StyleSheet,
  View
} from 'react-native';

class ChatsContainer extends Component{

  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      showErrorScreen: false
    }
  }

  componentWillMount(){
      this.props.getChats()
      .then((chats) => {
          this.setState({isLoading: false});
      })
      .catch((e) => {
        console.log(e);
        this.setState({showErrorScreen: true, isLoading: false});
      });
  }

  _goToChatScreen(chat){
    this.props.goToChat(chat);
    this.props.navigation.navigate('ChatsStack');
  }

  render() {
    return (
      <View style={styles.container}>
          {
            this.state.isLoading ?
            <MaterialIndicator style={{marginBottom: 100 }}color={Colors.AQUA_GREEN} size={50} /> :
            <ChatsScreen 
              chats={this.props.chats} 
              user={this.props.user} 
              goToScreen={(chat) => {this._goToChatScreen(chat)}} 
              getChats={this.props.getChats} 
              getMessages={async (chatId, page) => { return await this.props.getMessages(chatId, page)}}
            >Chat</ChatsScreen>
          }
          {
            !this.state.showErrorScreen ? null :
            <ErrorScreen close={() => {this.setState({showErrorScreen: false})}} />
          }
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
    console.log(state);
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