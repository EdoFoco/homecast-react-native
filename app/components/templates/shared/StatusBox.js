import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
  } from 'react-native';

export default class StatusBox extends Component{

  render() {
    return (
        <TouchableHighlight style={styles.container} onPress={this.props.close}>
            <View style={styles.box}>
                {
                    this.props.isSuccess ?
                    <MaterialIcons name="check-circle-outline" style={styles.successIcon}/> :
                    <MaterialIcons name="alert-circle-outline" style={styles.errorIcon}/>
                } 
                <Text style={styles.descriptionText} multiline={true}>{this.props.text}</Text>
                 <TouchableHighlight style={styles.closeButton} onPress={this.props.close}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableHighlight>
            </View>
        </TouchableHighlight>
    )
  }
}

StatusBox.PropTypes = {
    close: PropTypes.func.isRequired,
    isSuccess: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: 300,
        padding: 10
    },
    descriptionText:{
        fontSize: FontSizes.DEFAULT,
        color: Colors.LIGHT_GRAY,
        textAlign: 'center'
    },
    closeButton: {
        borderColor: Colors.VERY_LIGHT_GRAY,
        borderWidth: 1,
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        padding: 5
    },
    closeButtonText: {
        fontSize: FontSizes.DEFAULT,
        color: Colors.DARK_GREY
    },
    errorIcon: {
        fontSize: 50,
        color: Colors.RED,
        alignSelf: 'center',
        marginBottom: 20
    },
    successIcon: {
        fontSize: 50,
        color: Colors.AQUA_GREEN,
        alignSelf: 'center',
        marginBottom: 20
    }
})    
