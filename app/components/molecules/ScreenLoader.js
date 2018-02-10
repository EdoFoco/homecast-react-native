import React, { Component} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../atoms/Spinner';
import * as Colors from '../helpers/ColorPallette';
import * as FontSizes from '../helpers/FontSizes';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';

export default class ScreenLoader extends Component{

  render(){
      return(
        <View style={styles.container}>
            {
                !this.props.goBack ? null :
                <TouchableHighlight onPress={() => { this.props.goBack() }}><MCIcon name='chevron-left' style={styles.backButton}/></TouchableHighlight>
            }
            <Image style={styles.logo} source={require('../../img/HomeCastLogo_long_white.png')} />

            <View style={styles.controlsContainer}>
                <Spinner />
                <Text style={styles.message}>{this.props.message}</Text>
            </View>
        </View>
      )
    }
}

ScreenLoader.PropTypes = {
    message: PropTypes.string,
    goBack: PropTypes.func
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(34,45,55, 1)',
      paddingTop: 20
    },
    controlsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    message:{
        fontSize: FontSizes.VERY_SMALL_TEXT,
        color: Colors.AQUA_GREEN,
        alignSelf: 'flex-end',
        marginBottom: 40,
        alignSelf: 'center'
    },
    logo: {
        height: 150,
        width: 150,
        marginTop: 40,
        alignSelf: 'center'
    },
    backButton: {
        fontSize: FontSizes.BIG,
        color: Colors.AQUA_GREEN,
        alignSelf: 'flex-start'
    }
  });