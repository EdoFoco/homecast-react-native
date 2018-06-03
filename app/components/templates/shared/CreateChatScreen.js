import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
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

export default class CreateChatScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            messages: [],
            conversationId: null,
            message: null
        }
    }
   
    componentWillMount() {
        this.keyboardHeight = new Animated.Value(0);
        this.viewHeight = new Animated.Value(Dimensions.get('window').height - 70);
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }

    componentWillUnmount() {
        clearInterval(this.chatPoll);
    }

    keyboardWillShow = event => {
        Animated.timing(this.viewHeight, {
            duration: 150,
            toValue:   Dimensions.get('window').height - event.endCoordinates.height - 70,
        }).start();
    }

    keyboardWillHide = e => {
        Animated.spring(this.viewHeight, {
        duration: 150,
        toValue:   Dimensions.get('window').height - 70,
        }).start();
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
        if(this.state.conversationId){
            this.props.sendMessage(this.state.conversationId, this.state.message)
            .then((message) => {
                var messages = [...this.state.messages];
                messages.push({
                    sender: {
                        id: this.props.user.info.id,
                    },
                    body: this.state.message
                });
                this.setState({messages: messages});
            })
            .then(() => {
                this.setState({ message: null });
            })
            .catch((e) => {
                console.log(e);
            });
        }
        else{
            this.props.createChat(this.props.recipientIds)
            .then((chat) => {
                this.setState({conversationId: chat.id});
                return this.props.sendMessage(chat.id, this.state.message);
            })
            .then((message) => {
                var messages = [...this.state.messages];
                messages.push({
                    sender: {
                        id: this.props.user.info.id,
                    },
                    body: this.state.message
                });
                this.setState({messages: messages});
            })
            .then(() => {
                this.setState({ message: null });
            })
            .catch((e) => {
                console.log(e);
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableHighlight style={styles.backButton} onPress={() => {this.props.goBack()}} underlayColor={'rgba(0,0,0,0)'}>
                        <MaterialIcons name="chevron-left" style={styles.backButtonIcon}/>
                    </TouchableHighlight>
                    <Text style={styles.title}>Chat</Text>
                </View>
                <Animated.View style={{height: this.viewHeight}}>
                    <FlatList
                        style={styles.messagesList}
                        inverted={true}
                        data={this.state.messages.reverse()}
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
                            <MaterialIcons name="send" style={styles.sendIcon} />
                        </TouchableHighlight>
                    </View>
                </Animated.View>
            </View>
        )
  }
}

CreateChatScreen.propTypes ={
  user: PropTypes.object.isRequired,
  createChat: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  recipientIds: PropTypes.array.isRequired,
  goBack: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
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
    },
    backButton: {
        alignSelf: 'flex-start',
        flex: 0.1,
    },
    backButtonIcon: {
        fontSize: 45,
        color: Colors.AQUA_GREEN,
    },
    header: {
        flexDirection: 'row',
    },
    title: {
        flex: 0.9,
        fontSize: FontSizes.MEDIUM_BIG,
        color: Colors.AQUA_GREEN,
        textAlign: 'center'
    }
})    
