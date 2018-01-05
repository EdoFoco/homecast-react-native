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
    
    if(this.props.viewing.isLive){
        return ( 
        <TouchableHighlight style={styles.ctaBtnRed}>
            <Text style={styles.ctaText}>
                Join Live Cast
           </Text>
        </TouchableHighlight>)
    }
    
    if(this.props.viewing.viewing_reservation){
        return (<TouchableHighlight style={styles.ctaBtnRed} onPress={() => {this.props.cancelViewingReservation(this.props.user.info.id, this.props.viewing.viewing_reservation.id, this.props.navigation)}}>
            <Text style={styles.ctaText}>Cancel Reservation </Text>
        </TouchableHighlight>)
    }
    else{
        return (<TouchableHighlight style={styles.ctaBtnGreen} onPress={() => {this.props.createViewingReservation(this.props.user.info.id, this.props.viewing.id)}}>
            <Text style={styles.ctaText}>Reserve Slot</Text>
        </TouchableHighlight>)
    }
  }

 
  render() {
    return(
        <View style={{backgroundColor: 'white', flex: 1}}>
              <View style={{backgroundColor: Colors.DARK_BLUE, flexDirection: 'row', padding: 20 }}>
                  <Text style={styles.availabilityTitle}>Availability</Text>
                  <Text style={styles.availabilityValue}>{this.props.viewing.capacity} slots left</Text>
              </View>
            <ScrollView style={{backgroundColor: 'white', flex: 0.85}}>
                <Image style={styles.propertyImage} source={{url: this.props.viewing.property.thumbnail}} />
                <View style={styles.imageOverlay}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.weekDayStyle}>{new Date(`${this.props.viewing.date_time}`).toLocaleString('en-us', {  weekday: 'long' })}</Text>
                    <Text style={styles.dayStyle} >{new Date(`${this.props.viewing.date_time}`).getDate()}</Text>
                    <Text style={styles.monthStyle}>{new Date(`${this.props.viewing.date_time}`).toLocaleString('en-us', {  month: 'short' }).toUpperCase()}</Text>
                    <Text style={styles.timeStyle}>{new Date(`${this.props.viewing.date_time}`).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: true}).toUpperCase()}</Text>
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
                {/* {
                    !this.props.showViewPropertyBtn ? null :
                    <TouchableHighlight style={styles.goToPropertyBtn} onPress={() => {this.props.goToProperty()}}>
                        <View>
                            <Text style={styles.goToPropertyTxt}>View</Text>
                            <Text style={styles.goToPropertyTxt}>{this.props.viewing.property.name}</Text>
                        </View>
                    </TouchableHighlight>
                } */}
               
                {/* <View style={styles.container}>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.availabilityTitle}>Presenter</Text>
                        <View style={styles.userDetails}> 
                            <Text style={styles.userName}>{this.props.user.info.name}</Text>
                            <Image style={styles.userImage} source={{url: this.props.user.info.profile_picture}}/>
                            <Text style={styles.userAbout}>{this.props.user.info.about}</Text>
                    </View>
                    </View>
                </View> */}
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
    user: PropTypes.object.isRequired,
    cancelViewingReservation: PropTypes.func.isRequired,
    createViewingReservation: PropTypes.func.isRequired,
    goToProperty: PropTypes.func.isRequired,
    showViewPropertyBtn: PropTypes.bool.isRequired,
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center'
  },
  weekDayStyle: {
    color: 'white',
    fontSize: FontSizes.TITLE,
  },
  dayStyle: {
    color: 'white',
    fontSize: FontSizes.TITLE,
  },
  weekStyle: {
    color: 'white',
    fontSize: FontSizes.TITLE,
  },
  timeStyle: {
    color: 'white',
    fontSize: FontSizes.TITLE,
  },
  monthStyle: {
    color: 'white',
    fontSize: FontSizes.TITLE,
  },
  dateContainer: {
    alignSelf: 'center',
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 75,
    padding: 20
  }
});