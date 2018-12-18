import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableHighlight,
    TextInput,
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
            message: null,
            isLoadingMessages: true
        }
    }
   
    componentWillMount() {
        this.keyboardHeight = new Animated.Value(0);
        this.viewHeight = new Animated.Value(Dimensions.get('window').height - 60);
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
        
        this._getMessages()
        .then(() => {
            this.setState({isLoadingMessages: false});
        })
        .then(() => {
            this.chatPoll = setInterval(() => {
                this._getMessages();
            }, 10000);
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

    keyboardWillHide = () => {
        Animated.spring(this.viewHeight, {
            duration: 150,
            toValue: Dimensions.get('window').height - 60,
        }).start();
    }

    _getMessages(){
        return this.props.getMessages(this.props.chat.id, this.state.currentPage)
        .then((resp) => {
            this.setState({ messages: resp.data, currentPage: resp.current_page, lastPage: resp.last_page });
        })
        .catch((e) => {
            console.log(e);
        });
    }

    _renderMessageRow(item){
        var message = item.item;
        var isMyMessage = this.props.user.info.id == message.sender.id;

        if(isMyMessage){
            return (
                <View style={styles.messageRight}>
                    <View style={styles.messageWrapperRight}>
                        <View style={styles.blueMessage}>
                            <Text style={styles.senderName}>You</Text>
                            <Text style={styles.text} overflow="hidden">{message.body}</Text>
                        </View>
                    </View>
                </View>
            )
        }

        return(
            <View style={styles.messageLeft}>
                <View style={styles.messageWrapperLeft}>
                    <View style={styles.grayMessage}>
                        <Text style={styles.senderName}>{message.sender.name}</Text>
                        <Text style={styles.darkText} overflow="hidden">{message.body}</Text>
                    </View>
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
            Keyboard.dismiss();
        })
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
                {
                    this.state.isLoadingMessages ? 
                    <View style={styles.loadingContainer}><Text>Loading...</Text></View> :
                    <FlatList
                        style={styles.messagesList}
                        inverted={true}
                        data={this.state.messages}
                        renderItem={(message) => this._renderMessageRow(message)}
                        keyExtractor={(item, index) => index.toString()}
                        removeClippedSubviews={false}
                        pagingEnabled
                    />
                }
                
                    <View style={styles.inputContainer}>
                        <TextInput
                            keyboardAppearance='dark'
                            style={styles.messageInput}
                            onChangeText={(text) => this._messageTextChanged(text)}
                            value={this.state.message}
                            multiline={true}
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
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        flex: 1,
        justifyContent: 'flex-start'
    },
    messageRight: {
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5,
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
        padding: 10
    },
    grayMessage: {
        backgroundColor: Colors.WHITE_SMOKE,
        borderRadius: 15,
        marginRight: 60,
        padding: 10,
    },
    darkText: {
        color: Colors.LIGHT_GRAY,
        fontSize: FontSizes.DEFAULT,
        overflow: 'hidden',
    },
    text: {
        color: 'white',
        fontSize: FontSizes.DEFAULT,
        overflow: 'hidden',
    },
    inputContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: Colors.VERY_LIGHT_GRAY,
        padding: 10,
        backgroundColor: Colors.DARK_BLUE,
        height: 60,
        flex: 0.1,
        justifyContent: 'center',
        justifyContent: 'flex-end'
    },
    messageInput: {
        flex: 0.9,
        borderWidth: 1,
        borderColor: Colors.WHITE_SMOKE,
        borderRadius: 15,
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 5,
        marginTop: 5
    },
    sendButton: {
        alignItems: 'center',
        flex: 0.1,
        justifyContent: 'center',
        backgroundColor: 'white',
        marginLeft: 20,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 25,
        paddingLeft: 10,
        paddingRight: 6,
    },
    sendIcon: {
        fontSize: 32,
        color: Colors.AQUA_GREEN,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    messageWrapperLeft: {
        flexDirection:'row',
        flexWrap: 'wrap',
        flex: 1,
        justifyContent: 'flex-start'
    },
    messageWrapperRight: {
        flexDirection:'row',
        flexWrap: 'wrap',
        flex: 1,
        justifyContent: 'flex-end'
    },
    senderName:{
        fontSize: FontSizes.SMALL_TEXT,
        fontWeight: 'bold',
        color: Colors.DARK_GREY,
        padding: 0
    }
})    
