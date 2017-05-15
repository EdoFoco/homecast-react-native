import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import AuthForm from '../molecules/AuthForm';
import Loader from '../atoms/Loader';



const AuthContainer = ({ isLoggedIn, isAuthenticating, dispatch }) => {
  if (isAuthenticating) {
      return <Loader />
    }
  return (
    <AuthForm />
  );
};
const mapStateToProps = (state) => {
  console.log(state);
  return {
    isLoggedIn: state.user.isLoggedIn,
    isAuthenticating: state.user.isAuthenticating
  }
};


export default connect(mapStateToProps)(AuthContainer);
