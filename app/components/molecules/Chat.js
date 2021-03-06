import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { 
  View,
  StyleSheet,
  TextInput,
  ListView,
  Dimensions,
  Animated,
  Keyboard,
  Text} from 'react-native';

const textBoxOffset = 120;


export default class Chat extends Component{

    constructor(props) {
        super(props);
        this.state = { 
            currentMessage: ""
         };
      }
    
    ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
    });

    componentWillMount(){
        this.keyboardHeight = new Animated.Value(0);
        this.viewHeight = new Animated.Value(Dimensions.get('window').height - textBoxOffset);
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
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
    }

    keyboardDidShow = event => {
        Animated.timing(this.viewHeight, {
            duration: 150,
            toValue:   Dimensions.get('window').height - event.endCoordinates.height - 70,
        }).start();
    }

    keyboardDidHide = () => {
        Animated.spring(this.viewHeight, {
            duration: 150,
            toValue: Dimensions.get('window').height - textBoxOffset,
        }).start();
    }

    _renderRow = function(rowData){
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
            this.setState({ currentMessage: text });
        }
        else{
            this.setState({ currentMessage: '' });
        }

      }

    _sendMessage = function(){
        console.log('sending message:' + this.state.currentMessage);
        this.props.sendMessage({ roomId: this.props.chat.roomId, username: this.props.user.info.name, message: this.state.currentMessage });
        this.setState({currentMessage: ''});
        this.refs.message.clear();
    }

    render() {
        return (
            <Animated.View style={{height: this.viewHeight}}>
                <View style={styles.chatContainer}>
                    <View style={styles.listViewContainer}>
                        <ListView
                            renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                            dataSource={this.ds.cloneWithRows(this.props.chat.chatMessages, this.props.chat.chatMessages.map((index) => index).reverse())}
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
                        value={this.state.currentMessage}
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

Chat.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    chat: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
}

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
      backgroundColor: 'rgba(0,0,0,0)',
      alignSelf: 'stretch',
      flex: 1
    },
    chatContainer: {
      marginTop: 0,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 40,
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