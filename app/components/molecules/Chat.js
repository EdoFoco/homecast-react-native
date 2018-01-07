import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';
import * as Animatable from 'react-native-animatable';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

import { 
  View,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  ListView,
  ListViewDataSource,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  Animated,
  Keyboard,
  Text} from 'react-native';

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
  messageInput:{
      flex:3, 
      height: 35, 
      borderColor: 'rgba(255,255,255, 0.6)', 
      borderWidth: 1,
      borderRadius: 15,
      color: 'white',
      paddingLeft: 15,
      paddingRight: 15,
      fontSize: 16
  },
  chatInputGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  sendMessageButton: {
      flex:1, 
      justifyContent: 'center', 
      backgroundColor: 'rgba(0,0,0,0)', 
      borderRadius:10
    },
   messageUsername: {
       flex: 1, 
       color:'#B0BEC5', 
       fontSize: 12
    }
});

const textBoxOffset = 120;

class Chat extends Component{

    componentWillMount(){
        this.keyboardHeight = new Animated.Value(0);
        this.viewHeight = new Animated.Value(Dimensions.get('window').height - textBoxOffset);
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        //this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
        
        Animatable.initializeRegistryWithDefinitions(
        {
            myFadeOut: {
            from: {
                opacity: 1,
            },
            to: {
                opacity: 0.5,
            },
            }
        });
    
        this.props.connect({ roomId: this.props.chat.roomId, username: 'edo', isPresenter: false });
    }

    
    componentWillUnmount(){
        //this.keyboardDidShowSub.remove();
        //this.keyboardDidHideSub.remove();
        this.props.disconnect({ roomId: this.props.chat.roomId });
    }

    keyboardDidShow = event => {
        Animated.timing(this.viewHeight, {
            duration: 150,
            toValue:   Dimensions.get('window').height - event.endCoordinates.height - 70,
        }).start();
    }

    keyboardDidHide = e => {
        Animated.spring(this.viewHeight, {
        duration: 150,
        toValue:   Dimensions.get('window').height - textBoxOffset,
        }).start();
    }

    _renderRow = function(rowData, rowId){
        return (
            <Animatable.View animation="myFadeOut"  delay={3000}>
            <View style={{flex: 1,alignSelf: 'flex-start', backgroundColor: 'white', borderRadius:10, margin:10, padding:10}}>
                <Text style={styles.messageUsername}>{rowData.username}</Text>
                <Text style={{flex: 1, color:'black'}}>{rowData.message}</Text>
            </View>
            </Animatable.View>
            )
    }

    _messageTextChanged = function(text){
        if(text){
            this.props.userIsTyping({ roomId: this.props.chat.roomId, currentMessage: text, userIsTyping: true, username: this.props.user.info.name } );
            this.props.chatTextChanged( { currentMessage: text, userIsTyping: true, username: this.props.user.info.name } );
        }
        else{
            this.props.userIsTyping({ roomId: this.props.chat.roomId, currentMessage: '', userIsTyping: false, username: this.props.user.info.name } );
            this.props.chatTextChanged( { currentMessage: '', userIsTyping: false, username: this.props.user.info.name } );
        }

      }

    _sendMessage = function(){
        console.log('sending message:' + this.props.currentMessage);
        this.props.message({ roomId: this.props.chat.roomId, username: this.props.user.info.name, message: this.props.currentMessage });
        this.props.chatTextChanged( { currentMessage: '', userIsTyping: false, username: this.props.user.info.name } );
        this.props.userIsTyping({ roomId: this.props.chat.roomId, currentMessage: '', userIsTyping: false, username: this.props.user.info.name } );
        this.refs.message.clear();
    }

    render() {
        /*{ ((this.props.chat.usersTyping.indexOf(this.props.user.info.name) > -1 && this.props.chat.usersTyping.length > 1) || (this.props.chat.usersTyping.indexOf(this.props.user.info.name) == -1 && this.props.chat.usersTyping.length > 0)) &&
                            <View><Text>Someone is typing</Text></View>
                    }*/
        return (
            <Animated.View style={{height: this.viewHeight}}>
                <View style={styles.chatContainer}>
                    <View style={styles.listViewContainer}>
                        <ListView
                            renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                            dataSource={this.props.chatMessages}
                            enableEmptySections={true}
                            renderRow={(rowData, rowId) => this._renderRow(rowData, rowId)} 
                            />
                    </View>
                    
                    <View style={styles.chatInputGroup}>
                        <TextInput
                        ref='message'
                        keyboardAppearance='dark'
                        autoCorrect={false}
                        style={styles.messageInput}
                        onChangeText={(text) => this._messageTextChanged(text)}
                        value={this.props.currentMessage}
                        />
                        <FontAwesomeIcon.Button name="send-o" onPress={this._sendMessage.bind(this)}
                            style={styles.sendMessageButton} backgroundColor="rgba(0,0,0,0)">
                        </FontAwesomeIcon.Button>
                    </View>
                </View>
            </Animated.View>
        );
    
    }
}

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});


const mapStateToProps = (state) => {
    //Reorder row for inverted list view
    var rowIds = state.chat.chatMessages.map((row, index) => index).reverse();

    return {
        chatMessages: ds.cloneWithRows(state.chat.chatMessages, rowIds),
        currentMessage: state.chat.currentMessage,
        chat: state.chat,
        user: state.user
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
