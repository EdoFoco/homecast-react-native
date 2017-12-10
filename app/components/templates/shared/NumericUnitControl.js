import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EditPropertyActions from './EditPropertyActions';

import {
    TextInput,
    StyleSheet,
    View,
    Text,
    Dimensions
  } from 'react-native';

export default class NumericUnitControl extends Component{

  constructor(props) {
    super(props);

    this.state = {
        value: this.props.value
    }
   }

  
  _toInteger(text){
    var value = parseInt(text);
    if(isNaN(value)){
        return 0;
    }

    return value;
  }

  render() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.description}>{this.props.description}</Text>
            <TextInput style={styles.textInput}
                value={ this.props.value > 0 ? this.props.value.toString() : ""}
                onChangeText={(text) => {this.props.handleChange(this._toInteger(text))}}
                keyboardType="numeric"
            />
            <Text style={styles.unit}>{this.props.unit}</Text>

            <EditPropertyActions 
                property={this.props.property}
                updateProperty={() => {this.props.updateProperty()}}
                cancelChanges={() => {this.props.cancelChanges()}}
            />
        </View>
    )
  }
}

NumericUnitControl.PropTypes ={
    value: PropTypes.number.isRequired,
    property: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    updateProperty: PropTypes.func.isRequired,
    hideForm: PropTypes.func.isRequired,
    cancelChanges: PropTypes.func.isRequired

}

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    title: {
        fontSize: FontSizes.TITLE,
        color: Colors.DARK_GREY
    },
    description: {
        fontSize: FontSizes.SMALL_TEXT,
        color: Colors.LIGHT_GRAY
    },
    textInput: {
        marginTop: 20,
        height: 50,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GREY,
        borderRadius: 10,
        paddingLeft: 10
    },
    unit: {
        alignSelf: 'flex-end',
        marginRight: 10
    }
})    
