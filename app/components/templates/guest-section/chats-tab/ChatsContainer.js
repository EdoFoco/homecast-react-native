import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import * as Colors from '../../../helpers/ColorPallette';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import ChatsScreen from '../../shared/ChatsScreen';

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

  render() {
    return (
      <View style={styles.container}>
          <ChatsScreen chats={this.props.chats} user={this.props.user}>Chat</ChatsScreen>
          <NetworkErrorMessage isVisible={this.props.network.hasError} showError={(show) => {this.props.showNetworkError(show)}} />
      </View>
    )
  }
  
}

ChatsContainer.navigationOptions = {
  title: 'Chats',
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