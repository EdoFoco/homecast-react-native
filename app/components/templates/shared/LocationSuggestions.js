import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    FlatList
  } from 'react-native';

export default class LocationSuggestions extends Component{
   
    _selectAddress(suggestion){
        this.props.onPress(suggestion.item);
    }

    _renderRow(suggestion){
        return(
            <TouchableHighlight key={suggestion.item.place_id} style={styles.suggestionRow} onPress={() => {
                   this.props.onPress(suggestion.item)}}>
                <View style={styles.rowContainer}>
                    <MaterialIcons name="map-marker" style={styles.pin}/>
                    <Text style={styles.suggestionText}>{suggestion.item.description}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    render() {
        return (
            <FlatList
                style={{flex: 1}}
                data={this.props.suggestions}
                renderItem={(suggestion) => this._renderRow(suggestion)}
                removeClippedSubviews={false}
                keyboardShouldPersistTaps={'handled'}
            />     
        )
  }
}

LocationSuggestions.propTypes ={
    suggestions: PropTypes.array.isRequired,
    onPress: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    suggestionRow: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.WHITE_SMOKE,
    },
    suggestionText: {
        fontSize: FontSizes.SMALL_TEXT,
        color: Colors.LIGHT_GRAY,
        paddingTop: 2
    },
    rowButton: {
        backgroundColor: 'green'
    },
    rowContainer: {
        flexDirection: 'row',
    },
    pin: {
        color: Colors.AQUA_GREEN,
        fontSize: 24
    }
})    
