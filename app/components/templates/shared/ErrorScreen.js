import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as FontSizes from '../../helpers/FontSizes';
import * as Colors from '../../helpers/ColorPallette';
import FastImage from 'react-native-fast-image';
export default class ErrorScreen extends Component{

    render(){
        return (
            <View style={styles.container}>
                <FastImage style={styles.logo} source={require('../../../img/homecast_logo_color_6.png')} resizeMode={FastImage.resizeMode.contain}/>
                {
                    this.props.errorMessage ? 
                    <Text style={styles.errorMessage}>{this.props.errorMessage}</Text> :
                    <Text style={styles.errorMessage}>Sorry, something went wrong.</Text>
                }

                <TouchableOpacity style={styles.backButton} onPress={() => {this.props.close()}} activeOpacity={1}>
                    <Text style={styles.backText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

// ErrorScreen.PropTpes = {
//     close: PropTypes.func.isRequired,
//     errorMessage: PropTypes.errorMessage
// }

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: 200
    },
    errorMessage: {
        fontSize: FontSizes.MEDIUM_BIG,
        color: Colors.DARK_GREY
    },
    logo: {
        height: 120,
        width: 120
    },
    backButton: {
        marginTop: 40,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        backgroundColor: Colors.AQUA_GREEN
    },
    backText: {
        fontSize: FontSizes.MEDIUM_BIG,
        color: 'white'
    }
});