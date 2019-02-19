import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {
   TouchableOpacity,
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
        <TouchableOpacity activeOpacity={1.0} onPress={() => {this.props.goToViewing(this.props.viewing.id)}}>
            <View style={styles.viewingRow}>
                <EntypoIcons name="video-camera" style={styles.icon}/>
                <View style={styles.viewingDateContainer}>
                    {/* <Text>{this.props.viewing.status.status}</Text> */}
                    <Text style={styles.dateStyle}>{this._toDateString(this.props.viewing.date_time)}</Text>
                    <Text style={styles.viewingCapacity}>{this.props.viewing.capacity} slots left</Text>
                </View>
                <Text style={styles.viewingTime}>{new Date(`${this.props.viewing.date_time}`).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: true}).toUpperCase()}</Text>

            </View>
        </TouchableOpacity>
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
        margin: 10,
        paddingBottom: 10
    },
    viewingCapacity: {
        color: Colors.VERY_LIGHT_GRAY,
        fontSize: FontSizes.DEFAULT,
        textAlign: 'left',
        //borderWidth: 1,
      //  borderColor: Colors.DARK_BLUE,
        //borderRadius: 10,
    },
    viewingDateContainer: {
        flex: 0.6,
    },
    viewingTime:{
        fontSize: FontSizes.DEFAULT,
        textAlign: 'right',
        color: Colors.DARK_GREY,
        paddingRight: 5,
        flex: 0.4

    },
    dateStyle:{
        fontSize: FontSizes.DEFAULT,
        color: Colors.DARK_GREY,
        flex: 1,
        textAlign: 'left'
    },
    icon: {
        fontSize: FontSizes.TITLE,
        color: Colors.DARK_GREY,
        marginRight: 20
    }
})    
