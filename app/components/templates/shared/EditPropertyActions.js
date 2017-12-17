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

  constructor(props) {
    super(props);
  }

  
  render() {
    return (
        <View style={styles.container}>
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
        flexDirection: 'column',
        flex: 1
    },
    cancelButton: {
        backgroundColor: 'white',
        alignSelf: 'center',
        borderWidth: 1,
        height: 50,
        justifyContent: 'center',
        paddingRight: 10,
        paddingLeft: 10,
        borderColor: Colors.LIGHT_GRAY,
        width: Dimensions.get('window').width - 20,
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
        backgroundColor: Colors.RED,
        flex: 1,
        paddingRight: 20,
        paddingLeft: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width
    }
  
})    
