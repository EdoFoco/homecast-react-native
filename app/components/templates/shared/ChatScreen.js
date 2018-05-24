import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableHighlight,
    TextInput,
    KeyboardAvoidingView,
    Animated,
    Keyboard,
    Dimensions
  } from 'react-native';

export default class ChatScreen extends Component{

    chatPoll;

    constructor(props){
        super(props);
        this.state = {
            currentPage: 1,
            lastPage: 1,
            messages: [],
            message: null
        }
    }
   
    componentWillMount() {
        this.keyboardHeight = new Animated.Value(0);
        this.viewHeight = new Animated.Value(Dimensions.get('window').height - 120);
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
        
        this._getMessages()
        .then(() => {
            this.chatPoll = setInterval(() => {
                this._getMessages();
            }, 10000);
        })
        .catch((e) => {
            console.log(e);
        });
    }

    componentWillUnmount() {
        clearInterval(this.chatPoll);
    }

    keyboardWillShow = event => {
        Animated.timing(this.viewHeight, {
            duration: 150,
            toValue:   Dimensions.get('window').height - event.endCoordinates.height - 60,
        }).start();
    }

    keyboardWillHide = e => {
        Animated.spring(this.viewHeight, {
        duration: 150,
        toValue:   Dimensions.get('window').height - 120,
        }).start();
    }

    _getMessages(){
        return this.props.getMessages(this.props.chat.id, this.state.currentPage)
        .then((resp) => {
            this.setState({ messages: resp.data, currentPage: resp.current_page, lastPage: resp.last_page });
        });
    }

    _renderMessageRow(item){
        var message = item.item;

        return(
            <View style={this.props.user.info.id == message.sender.id ? styles.messageRight : styles.messageLeft}>
                <View style={this.props.user.info.id == message.sender.id ? styles.blueMessage : styles.grayMessage}>
                    <Text style={styles.text} overflow="hidden">{message.body}</Text>
                </View>
            </View>
        )
    }

    _messageTextChanged(text) {
        this.setState({ message: text });
    }

    _send(){
        this.props.sendMessage(this.props.chat.id, this.state.message)
        .then(() => {
            return this._getMessages();
        })
        .then(() => {
            this.setState({ message: null });
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Animated.View style={{height: this.viewHeight}}>

                <FlatList
                        style={styles.messagesList}
                        inverted={true}
                        data={this.state.messages}
                        renderItem={(message) => this._renderMessageRow(message)}
                        keyExtractor={(item, index) => index.toString()}
                        removeClippedSubviews={false}
                        pagingEnabled
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            keyboardAppearance='dark'
                            style={styles.messageInput}
                            onChangeText={(text) => this._messageTextChanged(text)}
                            value={this.state.message}
                        />
                        <TouchableHighlight style={styles.sendButton} onPress={() => {this._send()}}>
                            <MCIcon name="send" style={styles.sendIcon} />
                        </TouchableHighlight>
                    </View>
                    </Animated.View>
                </View>
        )
  }
}

ChatScreen.propTypes ={
  chat: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getMessages: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messagesList: {
        flex: 0.9
    },
    messageLeft: {
        margin: 10,
        flexDirection:'row',
        flexWrap: 'wrap',
        flex: 1,
        justifyContent: 'flex-start'
    },
    messageRight: {
        margin: 10,
        flexDirection:'row',
        flexWrap: 'wrap',
        flex: 1,
        justifyContent: 'flex-end'
    },
    blueMessage: {
        backgroundColor: Colors.LIGHT_BLUE,
        borderRadius: 15,
        marginLeft: 60,
        alignItems: 'flex-start',
    },
    grayMessage: {
        backgroundColor: Colors.VERY_LIGHT_GRAY,
        borderRadius: 15,
        marginRight: 60,
    },
    text: {
        color: 'white',
        fontSize: FontSizes.DEFAULT,
        overflow: 'hidden',
        borderRadius: 15,
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: Colors.WHITE_SMOKE,
        padding: 10,
        backgroundColor: Colors.WHITE_SMOKE,
        height: 60
    },
    messageInput: {
        flex: 0.8,
        borderWidth: 1,
        borderColor: Colors.WHITE_SMOKE,
        borderRadius: 15,
        padding: 10,
        backgroundColor: 'white'
    },
    sendButton: {
        alignItems: 'center',
        flex: 0.2,
        justifyContent: 'center'
    },
    sendIcon: {
        fontSize: FontSizes.BIG,
        color: Colors.LIGHT_BLUE,
    }
})    
