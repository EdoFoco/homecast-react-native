import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  ListView,
  ListViewDataSource,
  Platform,
} from 'react-native';


class Chat extends Component{

  componentWillMount(){
    this.props.initWebRTC();
  }

  receiveTextData(sender, data) {
    const textRoomData = this.props.webrtc.textRoomData.slice();
    const message = { user: sender, message: data };
    textRoomData.push(message);
    //RECEIVE TEXT STATE - receiveText
    this.props.receiveText(sender, textRoomData);
  }

  _sendMessage() {
    if (!this.props.webrtc.textRoomValue) {
      return
    }
    const textRoomData = this.props.webrtc.textRoomData.slice();
    const message = { user: 'Me', message: this.props.webrtc.textRoomValue };
    textRoomData.push(message);
  
    //Send TEXT STATE - sendText
    this.props.sendText( textRoomData, this.props.webrtc.textRoomValue );
  }

  render() {
       return (
        <View style={styles.listViewContainer}>
            <ListView
            dataSource={this.props.textRoomData}
            renderRow={rowData => <Text>{rowData.user + ':' + rowData.message}</Text>}
            />
            <TextInput
            style={{width: 200, height: 30, borderColor: 'gray', borderWidth: 1}}
            onChangeText={value => this.props.sendMessage( value )}
            value={this.props.webrtc.textRoomValue}
            />
            <TouchableHighlight
                onPress={this._sendMessage.bind(this)}>
                <Text>Send</Text>
            </TouchableHighlight>
        </View>
    );
     
    
  }
} 


const styles = StyleSheet.create({
  selfView: {
    width: 200,
    height: 150,
  },
  remoteView: {
    width: 200,
    height: 150,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  listViewContainer: {
    height: 150,
    backgroundColor: '#F9E9F9'
  },
});


const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});


const mapStateToProps = (state) => {
    console.log(state);
    return {
        webrtc: state.webrtc,
        textRoomData:  ds.cloneWithRows(state.webrtc.textRoomData)
   }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
