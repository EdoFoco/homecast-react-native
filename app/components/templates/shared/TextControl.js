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

export default class TextControl extends Component{

  constructor(props) {
    super(props);

    this.state = {
        value: this.props.value,
        originalProperty: this.props.originalProperty
    }
   }

  render() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.description}>{this.props.description}</Text>
            <TextInput style={styles.textInput}
                multiline={true} 
                value={this.props.value}
                onChangeText={(text) => {this.props.handleChange(text)}}
            />

            <EditPropertyActions 
                property={this.props.property}
                updateProperty={() => {this.props.updateProperty()}}
                cancelChanges={() => {this.props.cancelChanges()}}
            />
        </View>
    )
  }
}

TextControl.PropTypes ={
    value: PropTypes.string.isRequired,
    property: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
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
        fontSize: FontSizes.DEFAULT,
        color: Colors.LIGHT_GREY
    },
    textInput: {
        marginTop: 20,
        height: 50,
        fontSize: FontSizes.TITLE,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GREY
    }
})    
