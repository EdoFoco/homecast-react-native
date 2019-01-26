import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { MaterialIndicator  } from 'react-native-indicators';
import * as Colors from '../helpers/ColorPallette';
import * as FontSizes from '../helpers/FontSizes';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import {
  StyleSheet,
  Text,
  View,
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
            <FastImage style={styles.logo} source={require('../../img/homecast_logo_color_6.png')} resizeMode={FastImage.resizeMode.contain}/>
            <Text style={styles.title}>homecast</Text>
            <MaterialIndicator  style={styles.indicator} color={Colors.AQUA_GREEN} size={50} />
            <Text style={styles.message}>{this.props.message}</Text>
        </View>
      )
    }
}

ScreenLoader.propTypes = {
    message: PropTypes.string,
    goBack: PropTypes.func
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(34,45,55, 1)',
      paddingTop: 20
    },
    message:{
        flex: 0.1,
        fontSize: FontSizes.DEFAULT,
        color: 'white',
        alignSelf: 'flex-end',
        marginBottom: 40,
        alignSelf: 'center'
    },
    title:{
        flex: 0.1,
        fontSize: 32,
        color: 'white',
        alignSelf: 'center'
    },
    logo: {
        height: 120,
        width: 120,
        alignSelf: 'center'
    },
    indicator: {
        flex: 0.8, 
        justifyContent: 'flex-start',
        paddingTop: 100
    },
    backButton: {
        fontSize: FontSizes.BIG,
        color: Colors.AQUA_GREEN,
        alignSelf: 'flex-start'
    }
  });