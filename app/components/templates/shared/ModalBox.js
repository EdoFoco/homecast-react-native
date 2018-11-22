import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
  } from 'react-native';

export default class ModalBox extends Component{

  render() {
    return (
        <TouchableHighlight style={styles.container} onPress={this.props.close}>
            <View style={styles.box}>
                <Text style={styles.descriptionText} multiline={true}>{this.props.description}</Text>
                <TouchableHighlight style={styles.deleteButton} onPress={this.props.delete}>
                    <Text style={styles.deleteButtonText}>{this.props.deleteText}</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.closeButton} onPress={this.props.close}>
                    <Text style={styles.closeButtonText}>Back</Text>
                </TouchableHighlight>
            </View>
        </TouchableHighlight>
    )
  }
}

ModalBox.PropTypes = {
    close: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    deleteText: PropTypes.func.isRequired,
    description: PropTypes.string.isRequired
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
        fontSize: FontSizes.MEDIUM_BIG
    },
    closeButton: {
        borderColor: Colors.VERY_LIGHT_GRAY,
        borderWidth: 1,
        borderRadius: 10,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        padding: 10
    },
    closeButtonText: {
        fontSize: FontSizes.MEDIUM_BIG,
        color: Colors.DARK_GREY
    },
    deleteButton: {
        borderColor: Colors.RED,
        backgroundColor: Colors.RED,
        borderWidth: 1,
        borderRadius: 10,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        padding: 10
    },
    deleteButtonText: {
        fontSize: FontSizes.MEDIUM_BIG,
        color: 'white',
    },
})    
