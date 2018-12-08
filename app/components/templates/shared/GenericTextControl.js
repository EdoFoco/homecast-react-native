import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import {
    TextInput,
    StyleSheet,
    View,
    Text
  } from 'react-native';

export default class GenericTextControl extends Component{

  constructor(props) {
    super(props);

    this.state = {
        value: this.props.value
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
        </View>
    )
  }
}

GenericTextControl.propTypes ={
    value: PropTypes.string.isRequired,
    handleChange: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    multiline: PropTypes.boolean
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
        marginBottom: 10
    },
    textInput: {
        borderWidth: 1,
        height: 50,
        lineHeight: 25,
        borderColor: Colors.LIGHT_GRAY,
        borderRadius: 10,
        paddingLeft: 10,
        fontSize: FontSizes.DEFAULT
    },
    textInputLong: {
        borderWidth: 1,
        flex: 1,
        marginTop: 20,
        borderColor: Colors.LIGHT_GRAY,
        borderRadius: 10,
        paddingLeft: 10,
        fontSize: FontSizes.DEFAULT
    }
})    
