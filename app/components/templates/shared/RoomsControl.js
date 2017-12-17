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

export default class RoomsControl extends Component{

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
            <View style={{flex: 0.8}}>
                <Text style={styles.title}>{this.props.title}</Text>
                <Text style={styles.description}>{this.props.description}</Text>
                <View style={styles.roomsWrapper}>
                    <View style={styles.roomContainer}>
                        <Text style={styles.roomTitle}>Bedrooms</Text>
                        <TextInput style={styles.textInput}
                            value={ this.props.property.bedrooms > 0 ? this.props.property.bedrooms.toString() : ""}
                            onChangeText={(text) => {this.props.handleChangeBedrooms(this._toInteger(text))}}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.roomContainer}>
                        <Text style={styles.roomTitle}>Living Rooms</Text>
                        <TextInput style={styles.textInput}
                            value={ this.props.property.living_rooms > 0 ? this.props.property.living_rooms.toString() : ""}
                            onChangeText={(text) => {this.props.handleChangeLivingrooms(this._toInteger(text))}}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.roomContainer}>
                        <Text style={styles.roomTitle}>Bathrooms</Text>
                        <TextInput style={styles.textInput}
                            value={ this.props.property.bathrooms > 0 ? this.props.property.bathrooms.toString() : ""}
                            onChangeText={(text) => {this.props.handleChangeBathrooms(this._toInteger(text))}}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>
            <View style={{flex: 0.2}}>
                <EditPropertyActions 
                    property={this.props.property}
                    updateProperty={() => {this.props.updateProperty()}}
                    cancelChanges={() => {this.props.cancelChanges()}}
                />
            </View>
        </View>
    )
  }
}

RoomsControl.PropTypes ={
    property: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    handleChangeBedrooms: PropTypes.func.isRequired,
    handleChangeLivingrooms: PropTypes.func.isRequired,
    handleChangeBathrooms: PropTypes.func.isRequired,
    updateProperty: PropTypes.func.isRequired,
    hideForm: PropTypes.func.isRequired,
    cancelChanges: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
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
    roomContainer: {
        marginTop: 20,
        flex: 0.3,
        margin: 10
    },
    roomTitle: {
        fontSize: FontSizes.SMALL_TEXT,
        color: Colors.LIGHT_GRAY,
        alignSelf: 'center'
    },
    textInput: {
        marginTop: 5,
        height: 50,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GREY,
        borderRadius: 10,
        paddingLeft: 10,
        width: 75,
        alignSelf: 'center',
        alignItems: 'center'
    },
    roomsWrapper: {
        flexDirection: 'row'
    },
    actions: {
        alignSelf: 'flex-end',
    }
})    
