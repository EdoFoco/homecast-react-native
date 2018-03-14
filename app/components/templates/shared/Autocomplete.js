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
    Dimensions,
    TouchableHighlight,
    FlatList
  } from 'react-native';

export default class Autocomplete extends Component{

    constructor(props){
        super(props);
        this.state = {
            value: null,
            textInputValue: ''
        }
    }

    _selectAddress(suggestion){
        this.setState({textInputValue: suggestion.description});
        this.setState({ value: suggestion.item });
        this.props.setValue(suggestion);
    }

    _renderRow(suggestion){
        console.log(suggestion);
        return(
            <TouchableHighlight key={suggestion.item.place_id} style={styles.suggestionRow} onPress={() => {this._selectAddress(suggestion.item)}}>
                <Text style={styles.suggestionText}>{suggestion.item.description}</Text>
            </TouchableHighlight>
        )
    }

    _textChanged(text, type) {
        this.props.getLocationSuggestions(text, type);
        this.setState({textInputValue: text});
        this.setState({value: null});
        this.props.setValue(null);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <TextInput style={styles.textInput}
                        placeholder={this.props.placeholder}
                        value={this.state.textInputValue}
                        onChangeText={(text, type) => {this._textChanged(text, type)}}
                    />
                    <View style={styles.suggestionsContainer}>
                        <FlatList
                            data={this.props.suggestions}
                            renderItem={(suggestion) => this._renderRow(suggestion)}
                            keyExtractor={(item, index) => index}
                            removeClippedSubviews={false}
                        />
                    </View>
                </View>
            </View>
        )
  }
}

Autocomplete.PropTypes ={
    placeholder: PropTypes.string.isRequired,
    getLocationSuggestions: PropTypes.func.isRequired,
    suggestions: PropTypes.array.isRequired,
    setValue: PropTypes.func.isRequired
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
    },
    suggestionsContainer: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    suggestionRow: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.LIGHT_GRAY,
    },
    suggestionText: {
        fontSize: FontSizes.SMALL_TEXT,
        color: Colors.LIGHT_GRAY
    }
})    
