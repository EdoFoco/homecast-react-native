import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

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
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
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
  listViewContainer: {
    marginTop: 0,
    paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0)',
    alignSelf: 'stretch',
    flex: 1
  },
  chatContainer: {
    marginTop: 0,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'rgba(0,0,0,0)',
    alignSelf: 'stretch',
    flex: 1
  },
  chatInputGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch'
  }
});

class WebRTCChat extends Component{
 
  componentWillMount(){
    this.props.joinRoom({ roomId: this.props.webrtc.roomId, username: 'edo', socketId: this.props.webrtc.socketId, isPresenter: this.props.webrtc.isPresenter });
  }

  componentWillUnmount(){
    this.props.disconnect();
  }

 _renderRow = function(rowData, rowId){
   return (
     <View style={{flexWrap: 'wrap', backgroundColor: 'rgba(34, 167, 240, 0.6)', borderRadius:10, margin:10, padding:10}}>
      <Text style={{flex: 1, color:'white', fontWeight:'bold'}}>{rowData.username}</Text>
      <Text style={{flex: 1, color:'white'}}>{rowData.message}</Text>
    </View>
    )
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

  _setIsPresenter = function(){
    this.props.setIsPresenter(true);
  }

  render() {
       
        return (
          <View style={styles.chatContainer}>
             <TouchableHighlight
                  onPress={this._setIsPresenter.bind(this)}
                  style={{width:200, justifyContent: 'center', backgroundColor: 'blue', margin: 5, borderRadius:10}}>
                  <Text style={{textAlign: 'center', justifyContent: 'center', color:'white'}}>Set Presenter</Text>
              </TouchableHighlight>
            <View style={styles.listViewContainer}>
              <ListView
                renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                dataSource={this.props.chatMessages}
                renderRow={(rowData, rowId) => this._renderRow(rowData, rowId)} 
                />
              </View>
              <View style={styles.chatInputGroup}>
                <TextInput
                  ref='message'
                  autoCorrect={false}
                  style={{flex:3, height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(text) => this._messageTextChanged(text)}
                  value={this.props.currentMessage}
                />
                <TouchableHighlight
                  onPress={this._sendMessage.bind(this)}
                  style={{flex:1, justifyContent: 'center', backgroundColor: 'blue', margin: 5, borderRadius:10}}>
                  <Text style={{textAlign: 'center', justifyContent: 'center', color:'white'}}>Send</Text>
              </TouchableHighlight>
              </View>
                { ((this.props.webrtc.usersTyping.indexOf(this.props.user.user.name) > -1 && this.props.webrtc.usersTyping.length > 1) || (this.props.webrtc.usersTyping.indexOf(this.props.user.user.name) == -1 && this.props.webrtc.usersTyping.length > 0)) &&
                    <View><Text>Someone is typing</Text></View>
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
    //Re-order rows for inverted List View
    var rowIds = state.webrtc.chatMessages.map((row, index) => index).reverse();
    return {
        user: state.user,
        chatMessages: ds.cloneWithRows(state.webrtc.chatMessages, rowIds),
        currentMessage: state.webrtc.currentMessage,
        webrtc: state.webrtc
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WebRTCChat);
