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
    Text
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
            <View style={{flex: 0.8, margin: 10}}>
                <Text style={styles.title}>{this.props.title}</Text>
                <Text style={styles.description}>{this.props.description}</Text>
                <TextInput style={this.props.multiline ? styles.textInputLong : styles.textInput}
                    value={this.props.value}
                    onChangeText={(text) => {this.props.handleChange(text)}}
                    multiline={true} 
                />

            </View>
            <View style={{flex: 0.2}}>
                <EditPropertyActions 
                    property={this.props.property}
                    updateProperty={() => {this.props.updateProperty()}}
                    cancelChanges={() => {this.props.cancelChanges()}}
                    enabled={true}
                />
            </View>
        </View>
    )
  }
}

TextControl.propTypes ={
    value: PropTypes.string.isRequired,
    property: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    updateProperty: PropTypes.func.isRequired,
    hideForm: PropTypes.func.isRequired,
    cancelChanges: PropTypes.func.isRequired,
    multiline: PropTypes.bool
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: FontSizes.TITLE,
        color: Colors.DARK_GREY
    },
    description: {
        fontSize: FontSizes.SMALL_TEXT,
        color: Colors.LIGHT_GRAY,
    },
    textInput: {
        borderWidth: 1,
        height: 50,
        marginTop: 20,
        borderColor: Colors.LIGHT_GRAY,
        borderRadius: 10,
        paddingLeft: 10,
    },
    textInputLong: {
        borderWidth: 1,
        flex: 1,
        marginTop: 20,
        borderColor: Colors.LIGHT_GRAY,
        borderRadius: 10,
        paddingLeft: 10,
    },
    actions: {
        alignSelf: 'flex-end',
    }
})    
