import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';


const styles = StyleSheet.create({
  
    viewingCell: {
        flex: 1,
        backgroundColor: Colors.RED,
        paddingTop: 10,
        paddingBottom: 10
    },
    viewingTitle:{
        color: 'white',
        alignSelf: 'center',
        fontSize: FontSizes.SMALL_TEXT
    },
    viewingMonth: {
        color: 'white',
        alignSelf: 'center',
        fontSize: FontSizes.DEFAULT
      },
    viewingDay: {
        color: 'white',
        alignSelf: 'center',
        fontSize: FontSizes.BIG,
        fontWeight: 'bold'
      },
    viewingTime:{
        color: 'white',
        alignSelf: 'center',
        fontSize: FontSizes.DEFAULT
    }
});


 export default class DateCell extends Component{

  render() {
    return(
        <View style={styles.viewingCell}>
            <Text style={this.props.titleStyle ? [styles.viewingTitle, this.props.titleStyle] : styles.viewingTitle}>{new Date(`${this.props.dateTime} UTC`).toLocaleString('en-us', {  weekday: 'long' })}</Text>
            <Text style={this.props.dayStyle ? [styles.viewingDay, this.props.dayStyle] : styles.viewingDay} >{new Date(`${this.props.dateTime} UTC`).getDate()}</Text>
            <Text style={this.props.monthStyle ? [styles.viewingMonth, this.props.monthStyle]  : styles.viewingMonth}>{new Date(`${this.props.dateTime} UTC`).toLocaleString('en-us', {  month: 'short' }).toUpperCase()}</Text>
            {
                !this.props.showTime ? null :
                <Text style={this.props.timeStyle ? [styles.viewingTime, this.props.timeStyle]  : styles.viewingTime}>{new Date(`${this.props.dateTime} UTC`).toLocaleString([], {hour: '2-digit', minute:'2-digit'})}</Text>
            }
        </View>
    )
  }
}

DateCell.PropTypes = {
    dateTime: PropTypes.string.isRequired,
    showTime: PropTypes.boolean,
    titleStyle: PropTypes.object,
    dayStyle: PropTypes.object,
    monthStyle: PropTypes.object,
    timeStyle: PropTypes.object
}

