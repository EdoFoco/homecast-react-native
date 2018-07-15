import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import WebRTCChat from '../../../molecules/WebRTCChat';
import ScreenLoader from '../../../molecules/ScreenLoader';
import SocketService from '../../../../libs/services/SocketService';
import {
  StyleSheet,
  Text,
  View,
 } from 'react-native';

class LiveCastContainer extends Component{

  constructor(props){
    super(props);
    this.state = {
      socketId: null,
      roomStatus: {},
      presenterResponse: {},
      iceCandidates: []
    }
  }

  componentWillMount(){
    this.props.getViewing(this.props.navigation.state.params.viewing.id)
    .then((resp) => {
      console.log('room id is: ' + resp.id);
      return this.props.updateRoomId(resp.id);
    })
    .then(() => {
      console.log('About to connect!!');
      var connectionData = {
        roomId: this.props.navigation.state.params.viewing.id,
        username: this.props.user.info.name,
        isPresenter: false
      };

      SocketService.instance.connect(connectionData, this.onError, 
        (socketId) => {this.onSubscribed(socketId)},
        (roomStatus) => {this.onRoomStatus(roomStatus)},
        null,
        (viewerResponse) => {this.onViewerResponse(viewerResponse)},
        (candidate) => {this.onIceCandidate(candidate)}
      );

      //this.props.connect({ roomId: this.props.chat.roomId, username: 'edo', isPresenter: false });
    });
  }

  onError(err){
    //console.log(this.props.user.info.name);
    console.log(err);
  }

  onSubscribed(socketId){
    console.log(this.props.user.info.name);
    this.setState({socketId: socketId});
  }

  onRoomStatus(status){
    this.setState({roomStatus: status});
    console.log(this.state);
  }

  onViewerResponse(viewerResponse){
    this.setState({viewerResponse: viewerResponse})
    console.log(this.state);
  }

  onIceCandidate(candidate){
    var candidates = [...this.state.iceCandidates];
    console.log('candidate:' + candidate.candidate.candidate);
    candidates.push(candidate.candidate);
    this.setState({iceCandidates: candidates});
    console.log(this.state);
  }

  goBack(){
    SocketService.instance.kill();
    this.props.navigation.goBack();
  }

  componentWillUnmount(){
    this.props.disconnect({ roomId: this.props.chat.roomId });
  }

  render(){
    if(!this.state.roomStatus.presenterConnected){
      return(
        <ScreenLoader message={'WAITING FOR PRESENTER'} goBack={() => {this.goBack() }} />
      )
    }

    if(this.props.chat.roomId){
      return(
          <View style={styles.container}>
              <WebRTCChat style={{backgroundColor: 'green}', alignSelf: 'stretch'}}
                user={this.props.user} 
                chat={this.props.chat}
                webrtc={this.props.webrtc}
                connect={(data) => {this.props.connect(data)}}
                disconnect={(data) => {this.props.disconnect(data)}}
                sendMessage={(roomId, username, message) => { this.props.message(roomId, username, message)}}
                startViewer={(data) => {this.props.startViewer(data)}}
                sendOnIceCandidate={(data) => {this.props.sendOnIceCandidate(data)}}
                updateStreamUrl={(data) => {this.props.updateStreamUrl(data)}}
                updateConnectionStatus={(data) => {this.props.updateConnectionStatus(data)}}
                goBack={() => {this.goBack()}}
                publishEvent={(event) => { SocketService.instance.publishEvent(this.props.chat.roomId, event) }}
                iceCandidates={this.state.iceCandidates}
              />
          </View>
      );
    }
    else{
      return (<Text>Loading webrtc</Text>);
    }
  }
  
}

LiveCastContainer.navigationOptions = () => ({
    header: null
});



const mapStateToProps = ( state ) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        chat: state.chat,
        webrtc: state.webrtc
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveCastContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});