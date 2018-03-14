import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {
    Picker,
    StyleSheet,
    View,
    Text
  } from 'react-native';

export default class DropdownControl extends Component{

  constructor(props) {
    super(props);

    this.state = {
        value: this.props.value,
        optionsList: this.props.optionsList
    }
   }

  render() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.description}>{this.props.description}</Text>
            <Picker
                selectedValue={this.props.value}
                onValueChange={(itemValue, itemIndex) => { this.props.handleChange(itemValue) } }>
                {
                    this.state.optionsList.map((option) => {
                        return (<Picker.Item key={option} label={option} value={option} />)
                    })
                }
            </Picker>
        </View>
    )
  }
}

DropdownControl.PropTypes ={
    value: PropTypes.string.isRequired,
    optionsList: PropTypes.array.isRequired,
    property: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        marginBottom: 0
    },
    title: {
        fontSize: FontSizes.TITLE,
        color: Colors.DARK_GREY
    },
    description: {
        fontSize: FontSizes.DEFAULT,
        color: Colors.LIGHT_GREY
    }
})    
