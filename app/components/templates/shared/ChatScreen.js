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

export default class ChatScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            currentPage: 1,
            lastPage: 1,
            messages: []
        }
    }
   
    componentWillMount() {
        this.props.getMessages(this.props.chat.id, this.state.currentPage)
        .then((resp) => {
            this.setState({ messages: resp.data, currentPage: resp.current_page, lastPage: resp.last_page });
        })
        .catch((e) => {
            console.log(e);
        });
    }

    _renderMessageRow(item){
        var message = item.item;

        return(
            <View style={this.props.user.info.id == message.sender.id ? styles.messageLeft : styles.messageRight}>
                <View style={this.props.user.info.id == message.sender.id ? styles.blueMessage : styles.grayMessage}>
                    <Text style={styles.text} overflow="hidden">{message.body}</Text>
                </View>
            </View>
        )
    }

    render() {
        console.log(this.state);
        return (
            <View style={styles.container}>
               <FlatList
                    inverted={true}
                    data={this.state.messages}
                    renderItem={(message) => this._renderMessageRow(message)}
                    keyExtractor={(item, index) => index.toString()}
                    removeClippedSubviews={false}
                    pagingEnabled
                />
            </View>
        )
  }
}

ChatScreen.propTypes ={
  chat: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getMessages: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginRight: 60,
        alignItems: 'flex-start',
    },
    grayMessage: {
        backgroundColor: Colors.VERY_LIGHT_GRAY,
        borderRadius: 15,
        marginLeft: 60,
    },
    text: {
        color: 'white',
        fontSize: FontSizes.DEFAULT,
        overflow: 'hidden',
        borderRadius: 15,
        padding: 10,
    }
})    
