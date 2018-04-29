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

    _renderUsernames(users){
        var userNames = [];

        for (var user of users) {
            if(user.id != this.props.user.info.id){
                userNames.push(user.name);
            }
        }

        return userNames.join(', ');
    }

    _navigateToScreen(chat){
        this.props.goToScreen(chat);
    }

    _renderChatRow(item) {
        var chat = item.item;
        return(
            <TouchableHighlight onPress={() => {this._navigateToScreen(chat)}}>
                <View style={styles.chatRow}>
                    <FastImage style={styles.rowImage}  source={{  uri: chat.last_message.sender.profile_picture, priority: FastImage.priority.normal }} resizeMode={FastImage.resizeMode.cover} />
                    <View style={styles.rowDescriptionContainer}>
                        <Text style={styles.rowTitle}>{this._renderUsernames(chat.users)}</Text>
                        <Text style={styles.lastMessage} numberOfLines={1}>{chat.last_message.body}</Text>
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
                    pagingEnabled
                />
            </View>
        )
  }
}

ChatsScreen.propTypes ={
  chats: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  goToScreen: PropTypes.func.isRequired
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
