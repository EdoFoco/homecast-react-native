import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    TextInput,
    StyleSheet,
    View,
    TouchableHighlight  
} from 'react-native';

export default class Autocomplete extends Component{

    debouncerTimeout;

    _textChanged(text) {
        if(this.debouncerTimeout){
            clearInterval(this.debouncerTimeout);
        }
        this.props.onChange(text);
        this.debouncerTimeout = setTimeout(() => {this.props.getLocationSuggestions(text)}, 500);
    }

    
    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <TextInput style={styles.textInput}
                        placeholder={this.props.placeholder}
                        value={this.props.textValue}
                        height={this.props.height ? this.props.height : 50}
                        onChangeText={(text) => {this._textChanged(text)}}
                        onFocus={this.props.onFocus ? () => { this.props.onFocus() } : null}
                        onEndEditing={this.props.onFocus ? () => {this.props.onEndFocus() } : null}
                    />
                    {
                        !this.props.textValue ?  null:
                        <TouchableHighlight style={styles.cancelTextBtn} onPress={() => {this._textChanged("")}}>
                            <MaterialIcons name="close-circle" style={styles.buttonIcon}/>
                        </TouchableHighlight>
                    }
                   
                </View>
            </View>
        )
  }
}

Autocomplete.propTypes ={
    textValue: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    getLocationSuggestions: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onEndFocus: PropTypes.func
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
        borderColor: Colors.LIGHT_GRAY,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 20,
        backgroundColor: 'white',
        color: Colors.LIGHT_GRAY
    },
    cancelTextBtn: {
        position:'absolute',
        top: 7,
        right: 10,
        width: 24,
        height: 24,
    },
    buttonIcon: {
        fontSize: 24,
        color: Colors.LIGHT_GRAY
    }
})    
