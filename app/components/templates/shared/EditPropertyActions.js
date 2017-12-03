import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import {
    TouchableHighlight,
    StyleSheet,
    View,
    Text
} from 'react-native';

export default class EditPropertyActions extends Component{

  constructor(props) {
    super(props);
  }

  
  render() {
    return (
        <View style={styles.container}>
            <TouchableHighlight style={styles.cancelButton} onPress={() => {this.props.cancelChanges()}}>
                <Text style={styles.buttonTextDark}>Cancel Changes</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.saveButton} onPress={() => { this.props.updateProperty() }}>
                <Text style={styles.buttonTextLight}>Save Changes</Text>
            </TouchableHighlight>
        </View>
        
    )
  }
}

EditPropertyActions.PropTypes ={
    property: PropTypes.object.isRequired,
    saveProperty: PropTypes.func.isRequired,
    cancelChanges: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flexDirection: 'row'
    },
    cancelButton: {
        flex: 0.5,
        margin: 10,
        backgroundColor: 'white',
        alignSelf: 'center',
        borderWidth: 1
    },
    buttonTextDark:{
        color: Colors.DARK_GREY,
        fontSize: FontSizes.DEFAULT,
        alignSelf: 'center'
    },
    buttonTextLight:{
        color: 'white',
        fontSize: FontSizes.DEFAULT,
        alignSelf: 'center'
    },
    saveButton: {
        flex: 0.5,
        margin: 10,
        backgroundColor: Colors.RED,
        alignSelf: 'center',
        borderWidth: 1
    }
  
})    
