import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import {
    TouchableHighlight,
    StyleSheet,
    View,
    Text,
    Dimensions
} from 'react-native';

export default class EditPropertyActions extends Component{

  render() {
    return (
        <View style={styles.container}>
            <TouchableHighlight style={this.props.enabled ? styles.saveButton : styles.saveButtonDisabled} onPress={!this.props.enabled ? () => {} : () => { this.props.updateProperty() }}>
                <Text style={styles.buttonTextLight}>Save Changes</Text>
            </TouchableHighlight>
        </View>
        
    )
  }
}

EditPropertyActions.propTypes ={
    updateProperty: PropTypes.func.isRequired,
    enabled: PropTypes.bool
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1
    },
    buttonTextDark:{
        color: Colors.DARK_GREY,
        fontSize: FontSizes.DEFAULT,
        alignSelf: 'center'
    },
    buttonTextLight:{
        color: 'white',
        fontSize: FontSizes.DEFAULT,
        alignSelf: 'center',
    },
    saveButton: {
        backgroundColor: Colors.AQUA_GREEN,
        flex: 1,
        paddingRight: 20,
        paddingLeft: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width
    },
    saveButtonDisabled: {
        backgroundColor: Colors.LIGHT_GRAY,
        flex: 1,
        paddingRight: 20,
        paddingLeft: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width
    }
})    
