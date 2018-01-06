import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import {
   TouchableHighlight,
   View,
   Text,
   StyleSheet
  } from 'react-native';

export default class ViewingRow extends Component{

   _toDateString(date){
        let weekday = new Date(`${date}`).toLocaleString('en-us', {  weekday: 'short' });
        let day = new Date(`${date}`).getDate();
        let month = new Date(`${date}`).toLocaleString('en-us', {  month: 'short' });
        let year = new Date(`${date}`).toLocaleString('en-us', {  year: 'numeric' });

        return `${weekday}, ${day} ${month} ${year}`;
   }

   render() {
    return (
        <TouchableHighlight onPress={() => {this.props.goToViewing(this.props.viewing.id)}}>
            <View style={styles.viewingRow}>
                <View style={styles.viewingDateContainer}>
                    <Text style={styles.viewingTime}>{new Date(`${this.props.viewing.date_time}`).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: true}).toUpperCase()}</Text>
                    <Text style={styles.dateStyle}>{this._toDateString(this.props.viewing.date_time)}</Text>
                </View>
                <Text style={styles.viewingCapacity}>{this.props.viewing.capacity} slots left</Text>
            </View>
        </TouchableHighlight>
    )
  }
}

ViewingRow.PropTypes ={
    viewing: PropTypes.object.isRequired,
    gotToViewing: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
    viewingRow:{
        flex: 1,
        alignSelf: 'stretch',
        padding: 20,
        borderBottomColor: Colors.LIGHT_GRAY,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewingCapacity: {
        color: Colors.RED,
        fontSize: FontSizes.DEFAULT,
        textAlign: 'left',
        borderWidth: 1,
        borderColor: Colors.RED,
        padding: 5,
        borderRadius: 10,
        alignSelf: 'flex-end'
    },
    viewingDateContainer: {
        flex: 0.7,
    },
    viewingTime:{
        fontSize: FontSizes.DEFAULT,
        textAlign: 'left',
        color: Colors.DARK_GREY,
        paddingRight: 5
    },
    dateStyle:{
        fontSize: FontSizes.SMALL_TEXT,
        color: Colors.VERY_LIGHT_GRAY,
        flex: 1,
        textAlign: 'left'
    }
})    
