import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PlaceholderFastImage from './PlaceholderFastImage';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  Dimensions,
  RefreshControl
} from 'react-native';

export default class ViewingScreen extends Component{

  constructor(props){
    super(props)
    this.state = {
      isRefreshing: false
    }
  }


  _renderCTA(){
    var date = new Date(`${this.props.viewing.date_time}`);
  //   if(date < new Date()){
  //       return ( 
  //       <TouchableHighlight style={styles.ctaBtnGreen} onPress={() => {this.props.joinLiveCast()}}>
  //           <Text style={styles.ctaText}>
  //               Join Live Cast
  //          </Text>
  //       </TouchableHighlight>)
  //  }
    
    if(this.props.reservation){
      if(this.props.reservation.viewing.status.status == 'ACTIVE'){
        return (<TouchableHighlight style={styles.ctaBtnRed} onPress={() => {this.props.cancelViewingReservation(this.props.user.info.id, this.props.reservation.id)}}>
          <Text style={styles.ctaText}>Cancel Reservation </Text>
        </TouchableHighlight>)
      }
      return (
        <TouchableHighlight style={styles.ctaBtnDisabled} onPress={() => {}}>
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

    return `${weekday}, ${day} ${month}`;
  }
 
  _refresh(){
    this.setState({isRefreshing: true});
    this.props.getProperty(this.props.property.id)
    .then(() => {
      this.setState({isRefreshing: false})
    });
  }

  render() {
    return(
        <View style={{flex: 1}}>
            <View style={{backgroundColor: Colors.DARK_BLUE, flexDirection: 'row', alignItems: 'center', paddingRight: 10, paddingTop: 20}}>
                <TouchableHighlight style={styles.backButton} onPress={() => {this.props.goBack()}} underlayColor={'rgba(0,0,0,0)'}>
                  <MaterialIcons name="chevron-left" style={styles.backButtonIcon}/>
                </TouchableHighlight>
            </View>
            <ScrollView style={{backgroundColor: 'white', flex: 0.9}} refreshControl={
              <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={() => {this._refresh()}}
                />} >
                <PlaceholderFastImage style={styles.propertyImage} source={{uri: this.props.property.images.length > 0 ? this.props.property.images[0].url : ''}} />
                <View style={styles.imageOverlay}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.timeStyle}>{new Date(`${this.props.viewing.date_time}`).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: true}).toUpperCase()}</Text>
                    <Text style={styles.weekDayStyle}>{this._toDateString(this.props.viewing.date_time)}</Text>
                  </View>
                </View>
                
                  {
                    this.props.reservation ? 
                    <View style={styles.capacityContainer}>
                      <MaterialIcons name={this.props.viewing.status.status == 'ACTIVE' ? "check-circle-outline" : 'alert-circle-outline' } style={this.props.viewing.status.status == 'ACTIVE' ? styles.confirmationIcon : styles.alertIcon }/>
                      <Text style={styles.capacityText}>
                        {
                          this.props.viewing.status.status == 'ACTIVE' ?
                          'Your viewing is confirmed. You will receive a notification and will be able to join the live stream closer to the date.' :
                          'This viewing was cancelled by the agent'
                        }
                      </Text>
                    </View>
                    :
                    <View style={styles.capacityContainer}>
                      <MaterialIcons name="alert-outline" style={styles.warningIcon}/>
                      <Text style={styles.capacityText}>
                        There are only {this.props.viewing.capacity} spots left for this viewing. Remember to reserve a slot.
                      </Text>
                    </View>
                  }
                  {
                    this.props.viewing.status.status == 'ACTIVE' ?
                    <TouchableHighlight style={styles.joinLiveCast} onPress={() => {this.props.joinLiveCast()}}>
                      <Text style={styles.ctaText}>Join Live Cast</Text>
                    </TouchableHighlight>
                    :
                    <TouchableHighlight style={styles.joinLiveCastDisabled} onPress={() => {}}>
                      <Text style={styles.ctaText}>Join Live Cast</Text>
                    </TouchableHighlight>
                  }
                <TouchableHighlight style={styles.buttonContainer} onPress={() => {this.props.goToProperty()}}>
                    <View style={styles.buttonTextContainer}>
                        <Text style={styles.buttonText}>View Property Details</Text>
                        <FontAwesomeIcon name="home" style={styles.buttonIcon} /> 
                    </View>
                </TouchableHighlight>
                { 
                  this.props.user.info.id == this.props.property.user.id ? null : 
                  <TouchableHighlight style={styles.buttonContainer} onPress={this.props.contactAgent}>
                    <View style={styles.buttonTextContainer}>
                        <Text style={styles.buttonText}>Contact Agent</Text>
                        <FontAwesomeIcon name="envelope-o" style={styles.buttonIcon} /> 
                    </View>
                  </TouchableHighlight>
                } 
            </ScrollView>
            <View style={styles.joinCastContainer}>
               {this._renderCTA()}
            </View>
        </View>
    )
  }
}

ViewingScreen.propTypes = {
    viewing: PropTypes.object.isRequired,
    property: PropTypes.object.isRequired,
    reservation: PropTypes.object,
    user: PropTypes.object.isRequired,
    cancelViewingReservation: PropTypes.func.isRequired,
    createViewingReservation: PropTypes.func.isRequired,
    goToProperty: PropTypes.func.isRequired,
    showViewPropertyBtn: PropTypes.bool.isRequired,
    joinLiveCast: PropTypes.func.isRequired,
    contactAgent: PropTypes.func.isRequired
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
    flex: 0.3,
    textAlign: 'left',
    color: Colors.AQUA_GREEN,
    fontSize: FontSizes.DEFAULT,
    paddingBottom: 5
  },
  availabilityValue: {
    fontSize: FontSizes.DEFAULT,
    flex: 1,
    textAlign: 'right',
    color: Colors.AQUA_GREEN,
    paddingBottom: 5
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
  joinCastContainer: {
      backgroundColor: 'white',
      alignSelf: 'stretch',
      justifyContent: 'center',
      flex: 0.1
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
  ctaBtnDisabled: {
    backgroundColor: Colors.VERY_LIGHT_GRAY,
    flex: 1,
    justifyContent: 'center'
  },
  ctaText: {
      color: 'white',
      textAlign: 'center',
      fontSize: FontSizes.DEFAULT
  },
  propertyImage: {
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
  },
  backButton: {
    flex: 0.1,
    alignSelf: 'center'
  },
  backButtonIcon: {
    fontSize: 45,
    color: Colors.AQUA_GREEN,
  },
  capacityContainer:{
    flex: 1,
    alignSelf: 'stretch',
    padding: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  capacityText: {
    fontSize: FontSizes.DEFAULT,
    color: Colors.LIGHT_GRAY,
    marginLeft: 10,
    paddingRight: 20
  },
  alertIcon: {
    fontSize: 32,
    color: Colors.RED
  },
  warningIcon: {
    fontSize: 32,
    color: Colors.WARNING
  },
  confirmationIcon: {
    fontSize: 32,
    color: Colors.AQUA_GREEN
  },
  joinLiveCast: {
    backgroundColor: Colors.AQUA_GREEN,
    flex: 1,
    justifyContent: 'center',
    margin: 10,
    height: 60,
    borderRadius: 10
  },
  joinLiveCastDisabled: {
    backgroundColor: Colors.VERY_LIGHT_GRAY,
    flex: 1,
    justifyContent: 'center',
    margin: 10,
    height: 60,
    borderRadius: 10
  }
});