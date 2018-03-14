import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EditPropertyActions from './EditPropertyActions';
import Autocomplete from './Autocomplete';
import {
    StyleSheet,
    View,
    Text,
    Dimensions
  } from 'react-native';

export default class AutocompleteControl extends Component{

  constructor(props) {
    super(props);

    this.state = {
        value: false
    }
   }

 _setValue(value){
     this.setState({value: value});
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
               <Autocomplete  
                    style={styles.autocompleteContainer}
                    placeholder="Type an address" 
                    getLocationSuggestions={(text) => {this.props.getLocationSuggestions(text, 'address')}} 
                    suggestions={this.props.suggestions}
                    setValue={(value) => {this._setValue(value)}}/>
            </View>
            <View style={{flex: 0.2}}>
                <EditPropertyActions 
                    property={this.props.property}
                    updateProperty={() => {this.props.updateProperty()}}
                    cancelChanges={() => {this.props.cancelChanges()}}
                    enabled={this.state.value}
                />
            </View>
        </View>
    )
  }
}

AutocompleteControl.PropTypes ={
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    getLocationSuggestions: PropTypes.func.isRequired,
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
        color: Colors.DARK_GREY
    },
    description: {
        fontSize: FontSizes.SMALL_TEXT,
        color: Colors.LIGHT_GRAY
    },
    autocompleteContainer: {
        height: 10
    }
})    
