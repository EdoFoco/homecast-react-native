import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import EditPropertyActions from './EditPropertyActions';
import GenericTextControl from './GenericTextControl';
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
            <GenericTextControl 
                value={this.props.value}
                handleChange={(text) => {this.props.handleChange(text)}} 
                title={this.props.title}
                description={this.props.description}
                multiline={this.props.multiline} 
            />
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
    actions: {
        alignSelf: 'flex-end',
    }
})    
