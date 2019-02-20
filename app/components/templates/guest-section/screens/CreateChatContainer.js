import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import ChatScreen from '../../shared/ChatScreen';
import ErrorScreen from '../../shared/ErrorScreen';
import { StyleSheet, View} from 'react-native';

class CreateChatContainer extends Component{

  constructor(props){
    super(props);
    this.state = {
      chat: {
        users: this.props.navigation.state.params.recipients,
        message: this.props.navigation.state.params.message
      },
      showErrorScreen: false
    }
  }

  _sendMessage(chatId, text){
    var recipientIds = this.props.recipients.map(r => r.id);
    if(!chatId){
      return this.props.createChat(recipientIds)
      .then((chat) => {
        this.setState({ chat: chat });
        return this.props.sendMessage(chat.id, text);
      })
      .catch((e) => {
        console.log(e);
        this.setState({showErrorScreen: true});
      })
    }

    return this.props.sendMessage(this.state.chat.id, text)
    .catch((e) => {
      this.setState({showErrorScreen: true});
    });
  }

  async _returnEmptyChat(){
    return { data: [], current_page: 0, last_page: 0 };
  }

  _getMessages(page){
    if(this.state.chat.id){
      return this.props.getMessages(this.state.chat.id, page)
      .catch((e) => {
        console.log(e);
        this.setState({showErrorScreen: true});
      });
    }
    return this._returnEmptyChat();
  }
  
  render() {
    
    return (
      <View style={styles.container}>
        <ChatScreen 
            user={this.props.user} 
            chat={this.state.chat}
            message={this.state.chat.message}
            getMessages={(chatId, page) => { return new Promise((resolve, reject) => {
              resolve(this._getMessages(page));
              })}}
            sendMessage={(chatId, text) => {
              return new Promise((resolve, reject) => {
                  resolve(this._sendMessage(chatId, text));
              })}}
            goBack={this.props.navigation.goBack}
        />
        {
          !this.state.showErrorScreen ? null :
          <ErrorScreen close={() => { this.setState({showErrorScreen: false})}} />
        }
      </View>
    )
  }
  
}

const mapStateToProps = (state, {navigation}) => {
    console.log(navigation.state.params);
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        network: state.network,
        recipients: navigation.state.params.recipients
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateChatContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});