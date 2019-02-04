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
            {
                this.props.errorMessage ?
                <View style={{ flex: 0.8, paddingTop: 80 }}>
                    <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>
                </View> :
                <View style={styles.statusContainer}>
                    <MaterialIndicator  style={styles.indicator} color={Colors.AQUA_GREEN} size={50} />
                    <Text style={styles.message}>{this.props.message}</Text>
                </View>
            }
        </View>
      )
    }
}

ScreenLoader.propTypes = {
    message: PropTypes.string,
    goBack: PropTypes.func,
    errorMessage: PropTypes.string
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(34,45,55, 1)',
      paddingTop: 20
    },
    message:{
        fontSize: FontSizes.MEDIUM_BIG,
        color: 'white',
        alignSelf: 'flex-end',
        marginBottom: 40,
        alignSelf: 'center',
        marginTop: 40
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
    statusContainer: {
        flex: 0.8
    },
    indicator: {
        justifyContent: 'flex-start',
        marginTop: 80,
    },
    backButton: {
        fontSize: FontSizes.BIG,
        color: Colors.AQUA_GREEN,
        alignSelf: 'flex-start'
    },
    errorMessage: {
        alignSelf: 'center',
        fontSize: FontSizes.MEDIUM_BIG,
        color: 'white',
        paddingLeft: 40,
        paddingRight: 40,
        textAlign: 'center'
    }
  });