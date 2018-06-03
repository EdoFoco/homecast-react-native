import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableHighlight
  } from 'react-native';

export default class ChatsScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            isRefreshing: false
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
 
    _renderChatRow(item) {
        var chat = item.item;

        return(
            <TouchableHighlight onPress={() => {this.props.goToScreen(chat)}}>
                <View style={styles.chatRow}>
                    {
                        !chat.last_message.sender_profile_picture ? null :
                        <FastImage style={styles.rowImage}  source={{  uri: chat.last_message.sender_profile_picture, priority: FastImage.priority.normal }} resizeMode={FastImage.resizeMode.cover} />
                    }
                    <View style={styles.rowDescriptionContainer}>
                        <Text style={styles.rowTitle}>{this._renderUsernames(chat.users)}</Text>
                        <Text style={styles.lastMessage} numberOfLines={1}>{chat.last_message.body}</Text>
                        {
                            chat.wasRead ? null:
                            <Text>Not Read</Text>
                        }
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    render() {
        return (
            <View style={styles.container}>
               <FlatList
                    data={this.props.chats}
                    renderItem={(chat) => this._renderChatRow(chat)}
                    keyExtractor={(item, index) => index.toString()}
                    removeClippedSubviews={false}
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this._refresh()}
                />
            </View>
        )
  }
}

ChatsScreen.propTypes ={
  chats: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  goToScreen: PropTypes.func.isRequired,
  getChats: PropTypes.func.isRequired
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
        flex: 0.2,
        height: 60,
        width: 60,
        borderRadius: 30
    },
    rowDescriptionContainer: {
       paddingLeft: 20,
       flex: 0.8
    },
    rowTitle: {
        fontWeight: 'bold',
        fontSize: FontSizes.MEDIUM_BIG
    },
    lastMessage: {
        fontSize: FontSizes.DEFAULT,
        color: Colors.VERY_LIGHT_GRAY,
        marginTop: 14,
    }
})    
