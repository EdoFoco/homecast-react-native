import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EditPropertyActions from './EditPropertyActions';
import Autocomplete from './Autocomplete';
import LocationSuggestions from './LocationSuggestions';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Keyboard
  } from 'react-native';

export default class AutocompleteControl extends Component{

    constructor(props){
        super(props);
        this.state = {
            locationSearchValue: '',
            selectedLocation: null
        }
    }

    _selectLocation(suggestion){
        this.setState({locationSearchValue: suggestion.description})
        this.props.updateLocationSuggestions([]);
        this.setState({selectedLocation : suggestion});
        Keyboard.dismiss();
    }

    _handleLocationTextChange(text){
        this.setState({locationSearchValue: text});
        this.setState({selectedLocation: null});
    }

    _handleOnEndFocus(){
        this.props.updateLocationSuggestions([]);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 0.8}}>
                <Text style={styles.title}>{this.props.title}</Text>
                {
                    !this.props.description ? null :
                    <Text style={styles.description}>{this.props.description}</Text>
                }
                <View style={styles.autocompleteContainer}>
                    <Autocomplete
                        textValue={this.state.locationSearchValue}  
                        style={styles.autoComplete}
                        placeholder="Type an address" 
                        height={40}
                        getLocationSuggestions={(text) => {this.props.getLocationSuggestions(text, 'geocode')}}
                        onChange={(text) => {this._handleLocationTextChange(text)}}
                        onFocus={() => {}}
                        onEndFocus={() => {this._handleOnEndFocus()}}
                        />
                </View>
                <View style={styles.locationSuggestionsContainer}>
                    <LocationSuggestions 
                        style={styles.locationSuggestions}
                        suggestions={this.props.suggestions} 
                        onPress={(suggestion) => { this._selectLocation(suggestion) }}/>
                </View>
                </View>
                <View style={{flex: 0.2}}>
                    <EditPropertyActions 
                        property={this.props.property}
                        updateProperty={() => {this.props.updateProperty()}}
                        cancelChanges={() => {this.props.cancelChanges()}}
                        enabled={this.state.selectedLocation ? true : false}
                    />
                </View>
            </View>
        )
  }
}

AutocompleteControl.PropTypes ={
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    property: PropTypes.object.isRequired,
    cancelChanges: PropTypes.func.isRequired,
    updateProperty: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    getLocationSuggestions: PropTypes.func.isRequired,
    updateLocationSuggestions: PropTypes.func.isRequired,
    suggestions: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        marginBottom: 0,
        flex: 1
    },
    title: {
        fontSize: FontSizes.TITLE,
        color: Colors.DARK_GREY,
        marginBottom: 5
    },
    description: {
        fontSize: FontSizes.SMALL_TEXT,
        color: Colors.LIGHT_GRAY
    },
    autocompleteContainer: {
        flex:0.1
    },
    locationSuggestionsContainer: {
        flex: 0.7,
    }
})    
