import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableHighlight,
    TextInput
  } from 'react-native';

export default class ChatsScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false,
            textValue: "",
            filteredChats: []
        }
    }

    _renderUsernames(users){
        var userNames = [];

        for (var user of users) {
            if(user.id != this.props.user.info.id){
                userNames.push(user.name);
            }
        }

        return userNames.join(', ');
    }

    _refresh(){
        this.setState({isRefreshing: true});
        this.props.getChats()
        .then(() => {
            this.setState({isRefreshing: false});
        })
        .catch((e) => {
            this.setState({isRefreshing: false});
            console.log(e);
        })
    }
 
    _goToChatScreen(chat){
        this.props.goToScreen(chat);
    }

    _toDateString(date){
        let day = new Date(`${date}`).getDate();
        let month = new Date(`${date}`).toLocaleString('en-us', {  month: 'short' });
        
        return `${month} ${day}`;
    }

    _renderChatRow(item) {
        var chat = item.item;

        return(
            <TouchableHighlight onPress={() => {this._goToChatScreen(chat)}}>
                <View style={styles.chatRow}>
                    <View style={styles.unreadIconContainer}>
                        {
                            chat.wasRead ? null:
                            <View style={styles.unreadIcon}></View>
                        }
                    </View>

                    <View style={styles.rowDescriptionContainer}>
                        <View style={{flexDirection: 'row', flex: 1}}>
                            <Text style={styles.rowTitle}>{this._renderUsernames(chat.users)}</Text>
                            <Text style={styles.lastMessageTime}>{this._toDateString(chat.updated_at)}</Text>
                        </View>
                        <Text style={styles.lastMessage} numberOfLines={1}>{chat.last_message}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    _textChanged(text){
        if(text && text != ""){
            let visibleChats = [...this.props.chats.data];
            visibleChats = visibleChats.filter(c => c.sender_name.indexOf('text') > -1);
            this.setState({filteredChats: visibleChats});
        }
        else{
            this.setState({filteredChats: []});
        }
    }

    _onFocus(){

    }

    _onEndFocus(){

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.searchBarContainer}>
                    <TextInput style={styles.textInput}
                        placeholder="Search..."
                        value={this.state.textValue}
                        height={40}
                        onChangeText={(text) => {this._textChanged(text)}}
                        onFocus={this.props.onFocus ? () => { this._onFocus() } : null}
                        onEndEditing={this.props.onFocus ? () => {this._onEndFocus() } : null}
                    />
                </View>
               <FlatList
                    data={this.state.filteredChats.length > 0 ? this.state.filteredChats : this.props.chats.data}
                    renderItem={(chat) => this._renderChatRow(chat)}
                    keyExtractor={(item, index) => index.toString()}
                    removeClippedSubviews={false}
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this._refresh()}
                    extraData={this.props}
                />
            </View>
        )
  }
}

ChatsScreen.propTypes ={
  chats: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  goToScreen: PropTypes.func.isRequired,
  getChats: PropTypes.func.isRequired,
  getMessages: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chatRow: {
        flexDirection: 'row',
        flex: 1,
        alignSelf: 'stretch',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.WHITE_SMOKE    
    },
    rowImage: {
        height: 55,
        width: 55,
        borderRadius: 25
    },
    rowDescriptionContainer: {
       flex: 1,
       marginLeft: 10
    },
    rowTitle: {
        fontWeight: 'bold',
        fontSize: FontSizes.DEFAULT,
        flex: 0.9
    },
    lastMessageTime: {
        fontSize: FontSizes.SMALL_TEXT,
        flex: 0.2,
        color: Colors.LIGHT_GRAY
    },
    lastMessage: {
        fontSize: FontSizes.SMALL_TEXT,
        color: Colors.VERY_LIGHT_GRAY,
        marginTop: 0,
    },
    searchBarContainer: {
        backgroundColor: Colors.DARK_BLUE,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10
    },
    textInput: {
        borderWidth: 0.3,
        borderColor: Colors.LIGHT_GRAY,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 20,
        backgroundColor: 'white',
        color: Colors.LIGHT_GRAY,
        flex: 0.9,
        height: 20,
        fontSize: FontSizes.DEFAULT
    },
    cancelTextBtn: {
        position:'absolute',
        top: 7,
        right: 10,
        width: 24,
        height: 24,
    },
    buttonIcon: {
        fontSize: 24,
        color: Colors.LIGHT_GRAY
    },
    unreadIconContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: 10,
    },
    unreadIcon: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: Colors.AQUA_GREEN,
        shadowOffset:{  width: 0,  height: 0,  },
        shadowColor: Colors.AQUA_GREEN,
        shadowOpacity: 0.4,
    }
})    
