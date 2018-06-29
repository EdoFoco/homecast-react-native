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

export default class HorizontalViewingsList extends Component{

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
            </View>
        </TouchableHighlight>
    )
  }
}

HorizontalViewingsList.propTypes ={
    viewing: PropTypes.object.isRequired,
    gotToViewing: PropTypes.func
}

const styles = StyleSheet.create({
    viewingRow:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 5,
        borderColor: Colors.AQUA_GREEN,
        borderRadius: 10,
        borderWidth: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5
    },
    viewingCapacity: {
        color: Colors.RED,
        fontSize: FontSizes.MEDIUM_BIG,
        textAlign: 'left',
        borderWidth: 1,
        borderColor: Colors.RED,
        padding: 5,
        borderRadius: 10,
        height: 40,
        flex: 0.4
    },
    viewingDateContainer: {
        flex: 0.6,
    },
    viewingTime:{
        fontSize: FontSizes.DEFAULT,
        textAlign: 'center',
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
