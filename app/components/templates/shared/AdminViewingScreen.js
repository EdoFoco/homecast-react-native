import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalBox from '../shared/ModalBox';
import PlaceholderFastImage from './PlaceholderFastImage';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  Dimensions
} from 'react-native';

export default class AdminViewingScreen extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      showCancelDialogue: false
    }
  }

  _toDateString(date){
    let weekday = new Date(`${date}`).toLocaleString('en-us', {  weekday: 'short' });
    let day = new Date(`${date}`).getDate();
    let month = new Date(`${date}`).toLocaleString('en-us', {  month: 'short' });

    return `${weekday}, ${day} ${month}`;
  }

  _showModal(){
    this.setState({showCancelDialogue: true});
  }
 
  render() {
    if(!this.props.viewing){
      return <View></View>
    }
    return(
        <View style={{backgroundColor: 'white', flex: 1}}>
           <View style={{backgroundColor: Colors.DARK_BLUE, flexDirection: 'row', alignItems: 'center', paddingRight: 10, paddingTop: 20}}>
                <TouchableHighlight style={styles.backButton} onPress={() => {this.props.goBack()}} underlayColor={'rgba(0,0,0,0)'}>
                  <MaterialIcons name="chevron-left" style={styles.backButtonIcon}/>
                </TouchableHighlight>
            </View>
            <ScrollView style={{backgroundColor: 'white', flex: 0.85}}>
                <PlaceholderFastImage style={styles.propertyImage} source={{url: this.props.property.images.length > 0 ? this.props.property.images[0].url : ''}} />
                <View style={styles.imageOverlay}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.timeStyle}>{new Date(`${this.props.viewing.date_time}`).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: true}).toUpperCase()}</Text>
                    <Text style={styles.weekDayStyle}>{this._toDateString(this.props.viewing.date_time)}</Text>
                  </View>
                </View>
                <View style={styles.capacityContainer}>
                  <MaterialIcons name="check-circle-outline" style={styles.confirmationIcon}/>
                  <Text style={styles.capacityText}>
                    Your viewing is confirmed. It's time to invite people to join your live stream!
                  </Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableHighlight style={styles.ctaBtnGreen} onPress={() => {this.props.joinLiveCast()}}>
                      <Text style={styles.ctaText}>
                          Start Live Stream
                      </Text>
                  </TouchableHighlight>
                </View>
                <TouchableHighlight style={styles.buttonContainer} onPress={() => {this.props.goToProperty()}}>
                    <View style={styles.buttonTextContainer}>
                        <Text style={styles.buttonText}>Invite a Viewer</Text>
                        <MaterialIcons name="account-plus" style={styles.buttonIconMaterial}/>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.buttonContainer} onPress={() => {this.props.goToProperty()}}>
                    <View style={styles.buttonTextContainer}>
                        <Text style={styles.buttonText}>Contact Viewers</Text>
                        <FontAwesomeIcon name="envelope-o" style={styles.buttonIcon} /> 
                    </View>
                </TouchableHighlight>
            </ScrollView>
            <View style={styles.deleteViewingContainer}>
              <TouchableHighlight style={styles.deleteButton} onPress={() => {this._showModal()}}>
                <Text style={styles.deleteViewingText}>Cancel Viewing</Text>
              </TouchableHighlight>
            </View>
            {
              !this.state.showCancelDialogue ? null :
              <ModalBox 
                close={() => this.setState({showCancelDialogue: false})}
                delete={() => this.props.deleteViewing()}
                description="Are you sure you want to cancel this viewing?"
                deleteText="Cancel Viewing"
              />
            }
        </View>
    )
  }
}

AdminViewingScreen.propTypes = {
    viewing: PropTypes.object.isRequired,
    property: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    joinLiveCast: PropTypes.func.isRequired,
    network: PropTypes.object.isRequired,
    deleteViewing: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
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
  buttonIconMaterial: {
    color: Colors.AQUA_GREEN,
    alignSelf: 'flex-end',
    flex: 0.1,
    fontSize: 30,
    paddingRight: 5,
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
  deleteViewingContainer: {
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
    justifyContent: 'center',
    margin: 10,
    height: 60,
    borderRadius: 10
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
  deleteButton: {
    flex: 1,
    backgroundColor: Colors.RED,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteViewingText: {
    color: Colors.WHITE_SMOKE,
    textAlign: 'center',
    fontSize: FontSizes.DEFAULT
  },
  capacityContainer:{
    flex: 1,
    alignSelf: 'stretch',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  capacityText: {
    fontSize: FontSizes.DEFAULT,
    color: Colors.VERY_LIGHT_GRAY,
    marginLeft: 10,
  },
  confirmationIcon: {
    fontSize: 32,
    color: Colors.AQUA_GREEN
  },
  backButton: {
    flex: 0.1,
    alignSelf: 'center'
  },
  backButtonIcon: {
    fontSize: 45,
    color: Colors.AQUA_GREEN,
  },
});