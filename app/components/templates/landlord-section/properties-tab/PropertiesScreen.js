import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';

import {
  View,
  Button
} from 'react-native';


class PropertiesScreen extends Component {

  state = {
  }

  
  render() {
    return (
      <View style={{ flex: 1 }}>

        
      </View>
    );
  }
}


const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        user: state.user
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesScreen);
