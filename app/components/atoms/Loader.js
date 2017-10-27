import React, { PropTypes } from 'react';
import * as FontSizes from '../helpers/FontSizes';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
 } from 'react-native';


const styles = StyleSheet.create({
  message: {
    fontSize: FontSizes.DEFAULT,
    textAlign: 'center',
    margin: 10,
    color: '#F6F7F8'
  }
});

const Loader = () => {
    return <Text style={styles.message}>Authenticating...</Text>
};


export default Loader;

