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

ViewingRow.propTypes ={
    viewing: PropTypes.object.isRequired,
    gotToViewing: PropTypes.func
}

const styles = StyleSheet.create({
    viewingRow:{
        flex: 1,
        borderBottomColor: Colors.VERY_LIGHT_GRAY,
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10
    },
    viewingCapacity: {
        color: Colors.AQUA_GREEN,
        fontSize: FontSizes.MEDIUM_BIG,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: Colors.AQUA_GREEN,
        padding: 5,
        borderRadius: 10,
        height: 40,
        flex: 0.4
    },
    viewingDateContainer: {
        flex: 0.6,
    },
    viewingTime:{
        fontSize: FontSizes.MEDIUM_BIG,
        textAlign: 'left',
        color: Colors.DARK_GREY,
        paddingRight: 5
    },
    dateStyle:{
        fontSize: FontSizes.DEFAULT,
        color: Colors.VERY_LIGHT_GRAY,
        flex: 1,
        textAlign: 'left'
    }
})    
