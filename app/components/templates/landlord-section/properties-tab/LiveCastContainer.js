import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import SocketService from '../../../../libs/services/SocketService';
import AdminWebRTCChat from '../../../molecules/AdminWebRTCChat';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';



class LiveCastContainer extends Component{

  constructor(props){
    super(props);
    this.state = {
      socketId: null,
      roomStatus: {},
      iceCandidates: [],
      presenterResponse: {},
      webRtcError: false
    }
  }

  componentWillMount(){
    this.props.getViewing(this.props.navigation.state.params.viewing.id)
    .then((resp) => {
      return this.props.updateRoomId(resp.id);
    })
    .then(() => {
      console.log('About to connect!!');
      var connectionData = {
        roomId: this.props.navigation.state.params.viewing.id,
        username: this.props.user.info.name,
        isPresenter: true
      };

      SocketService.instance.connect(connectionData, this.onError, 
        (socketId) => {this.onSubscribed(socketId)},
        (roomStatus) => {this.onRoomStatus(roomStatus)},
        (presenterResponse) => {this.onPresenterResponse(presenterResponse)},
        null,
        (candidate) => {this.onIceCandidate(candidate)}
      );
    });
  }


  onError(err){
    console.log(err);
    this.setState({webRtcError: true});
  }

  onSubscribed(socketId){
    console.log(this.props.user.info.name);
    this.setState({socketId: socketId});
  }

  onRoomStatus(status){
    this.setState({roomStatus: status});
    console.log(this.state);
  }

  onPresenterResponse(presenterResponse){
    this.setState({presenterResponse: presenterResponse})
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

  render(){
    console.log(this.state.roomStatus);
    if(this.props.chat.roomId){
      return(
          <View style={styles.container}>
            <AdminWebRTCChat 
              user={this.props.user} 
              chat={this.props.chat}
              sendMessage={(roomId, username, message) => { this.props.message(roomId, username, message)}}
              navigation={this.props.navigation}
              network={this.props.network}
              publishEvent={(event) => { SocketService.instance.publishEvent(this.props.chat.roomId, event) }}
              iceCandidates={this.state.iceCandidates}
              sdpAnswer={this.state.presenterResponse.sdpAnswer}
              hasError={this.state.hasError}
              />
          </View>
      );
    }
    else{
      return (<TouchableHighlight style={{marginTop: 150}}onPress={() => {this.goBack()}}><Text>Loading webrtc</Text></TouchableHighlight>);
    }
  }
  
}

LiveCastContainer.navigationOptions = ({ navigation }) => ({
  header: null
});

const mapStateToProps = ( state, navigation ) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        chat: state.chat,
        webrtc: state.webrtc,
        network: state.network
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveCastContainer);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  
});