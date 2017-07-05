import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';

import { 
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  AsyncStorage,
  TextInput,
  ListView,
  ListViewDataSource,
  Text } from 'react-native';


var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 0,
    padding: 0,
    backgroundColor: '#ffffff',
    width:300
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    width: 100
  },
  form: {
      
  }
});

class WebRTCChat extends Component{
 

  componentWillMount(){
    this.props.joinRoom({ roomId: this.props.webrtc.roomId, username: 'edo' });
  }

  componentWillUnmount(){
    this.props.disconnect();
  }

  _messageTextChanged = function(text){
    if(text){
      this.props.userIsTyping({ roomId: this.props.webrtc.roomId, currentMessage: text, userIsTyping: true, username: this.props.user.user.name } );
      this.props.chatTextChanged( { currentMessage: text, userIsTyping: true, username: this.props.user.user.name } )
    }
    else{
      this.props.userIsTyping({ roomId: this.props.webrtc.roomId, currentMessage: '', userIsTyping: false, username: this.props.user.user.name } );
      this.props.chatTextChanged( { currentMessage: '', userIsTyping: false, username: this.props.user.user.name } )
    }

  }

  _sendMessage = function(){
    console.log('sending message:' + this.props.currentMessage);
    this.props.message({ roomId: this.props.webrtc.roomId, username: this.props.user.user.name, message: this.props.currentMessage });
    this.props.chatTextChanged( { currentMessage: '', userIsTyping: false, username: this.props.user.user.name });
    this.refs.message.clear();
  }

  render() {
        
        return (
          <View style={styles.listViewContainer}>
            <ListView
              dataSource={this.props.chatMessages}
              renderRow={rowData => <Text>{rowData.username + ':' + rowData.message}</Text>}
              />
              <TextInput
                ref='message'
                autoCorrect={false}
                style={{width: 200, height: 40, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => this._messageTextChanged(text)}
                value={this.props.currentMessage}
              />
              <TouchableHighlight
                onPress={this._sendMessage.bind(this)}>
              <Text>Send</Text>
            </TouchableHighlight>
              { this.props.webrtc.usersTyping.length > 0 &&
                  <Text>Send</Text>
              }
           </View>
        );
  }
}

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});


const mapStateToProps = (state) => {
    console.log(state);
    return {
        user: state.user,
        chatMessages: ds.cloneWithRows(state.webrtc.chatMessages),
        currentMessage: state.webrtc.currentMessage,
        webrtc: state.webrtc
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WebRTCChat);
