import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
 } from 'react-native';


const styles = StyleSheet.create({
  message: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#F6F7F8'
  }
});

const Loader = () => {
    return <Text style={styles.message}>Authenticating...</Text>
};


export default Loader;

