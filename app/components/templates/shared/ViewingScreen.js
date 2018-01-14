import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../actions';
import { bindActionCreators } from 'redux';
import DateCell from './DateCell';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  Button,
  Image,
  Dimensions
} from 'react-native';

export default class ViewingScreen extends Component{

  
  _renderCTA(){
    //if(this.props.viewing.isLive){
        return ( 
        <TouchableHighlight style={styles.ctaBtnGreen} onPress={() => {this.props.joinLiveCast()}}>
            <Text style={styles.ctaText}>
                Join Live Cast
           </Text>
        </TouchableHighlight>)
    //}
    
    if(this.props.reservation){
        return (<TouchableHighlight style={styles.ctaBtnRed} onPress={() => {this.props.cancelViewingReservation(this.props.user.info.id, this.props.reservation.id, this.props.navigation)}}>
            <Text style={styles.ctaText}>Cancel Reservation </Text>
        </TouchableHighlight>)
    }
    else{
        return (<TouchableHighlight style={styles.ctaBtnGreen} onPress={() => {this.props.createViewingReservation(this.props.user.info.id, this.props.viewing.id)}}>
            <Text style={styles.ctaText}>Reserve Slot</Text>
        </TouchableHighlight>)
    }
  }

  _toDateString(date){
    let weekday = new Date(`${date}`).toLocaleString('en-us', {  weekday: 'short' });
    let day = new Date(`${date}`).getDate();
    let month = new Date(`${date}`).toLocaleString('en-us', {  month: 'short' });
    let year = new Date(`${date}`).toLocaleString('en-us', {  year: 'numeric' });

    return `${weekday}, ${day} ${month}`;
  }
 
  render() {
    return(
        <View style={{backgroundColor: 'white', flex: 1}}>
              <View style={{backgroundColor: Colors.DARK_BLUE, flexDirection: 'row', padding: 20 }}>
                  <Text style={styles.availabilityTitle}>Availability</Text>
                  <Text style={styles.availabilityValue}>{this.props.viewing.capacity} slots left</Text>
              </View>
            <ScrollView style={{backgroundColor: 'white', flex: 0.85}}>
                <Image style={styles.propertyImage} source={{url: this.props.property.thumbnail}} />
                <View style={styles.imageOverlay}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.timeStyle}>{new Date(`${this.props.viewing.date_time}`).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: true}).toUpperCase()}</Text>
                    <Text style={styles.weekDayStyle}>{this._toDateString(this.props.viewing.date_time)}</Text>
                  </View>
                </View>

                <TouchableHighlight style={styles.buttonContainer} onPress={() => {this.props.goToProperty()}}>
                    <View style={styles.buttonTextContainer}>
                        <Text style={styles.buttonText}>View Property</Text>
                        <FontAwesomeIcon name="home" style={styles.buttonIcon} /> 
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.buttonContainer} onPress={() => {this.props.goToProperty()}}>
                    <View style={styles.buttonTextContainer}>
                        <Text style={styles.buttonText}>Contact Agent</Text>
                        <FontAwesomeIcon name="envelope-o" style={styles.buttonIcon} /> 
                    </View>
                </TouchableHighlight>
            </ScrollView>
            <View style={styles.joinCastContainer}>
               {this._renderCTA()}
            </View>
        </View>
    )
  }
}

ViewingScreen.PropTypes = {
    viewing: PropTypes.object.isRequired,
    property: PropTypes.object.isRequired,
    reservation: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    cancelViewingReservation: PropTypes.func.isRequired,
    createViewingReservation: PropTypes.func.isRequired,
    goToProperty: PropTypes.func.isRequired,
    showViewPropertyBtn: PropTypes.bool.isRequired,
    joinLiveCast: PropTypes.func.isRequired
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10
  },
  viewingDate: {
    height: 200,
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors.React
  },
  viewingTitle: {
    marginTop: 20,
    fontSize: 26,
  },
  viewingDay: {
    fontSize: 40
  },
  viewingMonth: {
    fontSize: 26
  },
  viewingTime: {
    fontSize: 25,
    marginTop: 10
  },
  sectionContainer: {
    flex: 1,
    alignSelf: 'stretch',
    marginTop: 20,
  },
  buttonContainer:{
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  buttonTextContainer: {
    flexDirection: 'row',
    padding: 20
  },
  buttonText: {
    fontSize: FontSizes.DEFAULT,
    flex: 0.5
  },
  buttonText: {
    alignSelf: 'flex-start',
    fontSize: FontSizes.DEFAULT,
    color: Colors.DARK_GREY,
    flex: 0.9
  },
  buttonIcon: {
    color: Colors.AQUA_GREEN,
    alignSelf: 'flex-end',
    flex: 0.1,
    fontSize: 28,
    fontWeight: '100'
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch',
    flex: 1,
  },
  availabilityTitle:{
    textAlign: 'left',
    color: Colors.AQUA_GREEN,
    fontSize: FontSizes.DEFAULT,
  },
  availabilityValue: {
    fontSize: FontSizes.DEFAULT,
    flex: 0.6,
    textAlign: 'right',
    color: 'white',
  },
  secureSpotBtn: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.AQUA_GREEN,
    padding: 10,
  },
  cancelReservationBtn: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.RED,
    padding: 10,
  },
  secureBtnText: {
    fontSize: FontSizes.DEFAULT,
    color: 'white',
  },
  userDetails: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 10
  },
  userImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 10
  },
  userName: {
      fontSize: FontSizes.DEFAULT
  },
  userAbout: {
      marginTop: 10,
      fontSize: FontSizes.DEFAULT,
      color: Colors.DARK_GREY,
      textAlign: 'left',
      alignSelf: 'stretch'
  },
  joinCastContainer: {
      backgroundColor: 'white',
      alignSelf: 'stretch',
      justifyContent: 'center',
      flex: 0.15
  },
  ctaBtnRed: {
    backgroundColor: Colors.RED,
    flex: 1,
    justifyContent: 'center'
  },
  ctaBtnGreen: {
    backgroundColor: Colors.AQUA_GREEN,
    flex: 1,
    justifyContent: 'center'
  },
  ctaText: {
      color: 'white',
      textAlign: 'center',
      fontSize: FontSizes.DEFAULT
  },
  propertyImage: {
    flex: 1,
    height: 250
  },
  imageOverlay:{
    position: 'absolute',
    top: 0,
    width: Dimensions.get('window').width,
    height: 250,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center'
  },
  weekDayStyle: {
    color: 'white',
    fontSize: FontSizes.DEFAULT,
  },
  dayStyle: {
    color: 'white',
    fontSize: FontSizes.DEFAULT,
  },
  timeStyle: {
    color: 'white',
    fontSize: FontSizes.TITLE,
    marginTop: 10,
    fontWeight: 'bold',
  },
  monthStyle: {
    color: 'white',
    fontSize: FontSizes.DEFAULT,
  },
  dateContainer: {
    alignSelf: 'center',
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 90,
    padding: 20,
  }
});