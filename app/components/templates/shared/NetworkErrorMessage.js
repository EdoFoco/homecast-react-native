import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';

import { View, Text, StyleSheet } from 'react-native';

export default class NetworkErrorMessage extends Component{

  componentWillMount(){
    setTimeout(() => { 
        this.props.showError(false) 
    }, 10000);
  }

  render() {
    if(!this.props.isVisible){
        return null;
    }

    return (
        <View style={styles.container}>
           <Text style={styles.text}>Network Error</Text>
        </View>
    )
  }
}

NetworkErrorMessage.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    showError: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        position: 'absolute',
        alignSelf: 'stretch',
        height: 40,
        top: 0,
        left: 0,
        right: 0,
        justifyContent: 'center'
    },
    text: {
        color: Colors.WHITE_SMOKE,
        fontSize: FontSizes.DEFAULT,
        alignSelf: 'center'
    }
})    
