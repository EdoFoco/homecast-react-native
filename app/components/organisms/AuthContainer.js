import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { ActionCreators } from '../../actions';
import { bindActionCreators } from 'redux';
import AuthForm from '../molecules/AuthForm';
import Loader from '../atoms/Loader';
import {
  Button,
  StyleSheet,
  View,
  AsyncStorage
} from 'react-native';

class AuthContainer extends Component{
  
  
  render(){
    if (this.props.isAuthenticating) {
      return <Loader />
    }
    return (
      <AuthForm />
    );
  }
 
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    isLoggedIn: state.user.isLoggedIn,
    isAuthenticating: state.user.isAuthenticating
  }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(AuthContainer);
