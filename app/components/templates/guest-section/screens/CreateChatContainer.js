import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import * as Colors from '../../../helpers/ColorPallette';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import CreateChatScreen from '../../shared/CreateChatScreen';

import {
  StyleSheet,
  View,
  FlatList,
  Text
} from 'react-native';


class CreateChatContainer extends Component{

  render() {
    return (
      <View style={styles.container}>
        <CreateChatScreen 
            user={this.props.user} 
            createChat={this.props.createChat} 
            sendMessage={this.props.sendMessage}
            recipientIds={this.props.recipientIds}
            goBack={this.props.navigation.goBack}
        />
      </View>
    )
  }
  
}

const mapStateToProps = (state, {navigation}) => {
    
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user,
        network: state.network,
        recipientIds: navigation.state.params.recipientIds
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateChatContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});