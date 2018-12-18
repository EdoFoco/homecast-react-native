import React, { Component} from 'react';
import PropTypes from 'prop-types';
import * as Colors from '../../helpers/ColorPallette';
import * as FontSizes from '../../helpers/FontSizes';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalBox from '../shared/ModalBox';
import PlaceholderFastImage from './PlaceholderFastImage';
import GenericTextControl from './GenericTextControl';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import StatusBox from './StatusBox';

export default class AdminViewingScreen extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      showCancelDialogue: false,
      showForm: false,
      invitationEmail: '',
      showStatusBox: false,
      isStatusSuccess: false,
      statusBoxText: ''
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

  _resetEmailInvitation(){
    this.setState({invitationEmail: '', showForm: false});
  }

  _sendViewingInvitation(){
    this.props.sendInvitationEmail(this.props.viewing.id, this.state.invitationEmail)
    .then(() => {
      this.setState({showForm: false, invitationEmail: '', statusBoxText: 'Viewing invitation sent!', isStatusSuccess: true, showStatusBox: true});
    })
    .catch(() => {
      this.setState({showForm: false, invitationEmail: '', statusBoxText: 'There was a problem sending this viewing invitation. Is the email in the correct format?', isStatusSuccess: false, showStatusBox: true});
    })
  }
 
  render() {
    if(!this.props.viewing){
      return <View></View>
    }

    var time = new Date();
    return(
        <View style={{backgroundColor: 'white', flex: 1}}>
           <View style={{backgroundColor: Colors.DARK_BLUE, flexDirection: 'row', alignItems: 'center', paddingRight: 10, paddingTop: 20}}>
                <TouchableHighlight style={styles.backButton} onPress={() => {this.props.goBack()}} underlayColor={'rgba(0,0,0,0)'}>
                  <MaterialIcons name="chevron-left" style={styles.backButtonIcon}/>
                </TouchableHighlight>
            </View>
            <ScrollView style={{backgroundColor: 'white', flex: 0.85}}>
                <PlaceholderFastImage style={styles.propertyImage} source={{uri: this.props.property.images.length > 0 ? this.props.property.images[0].url : ''}} />
                <View style={styles.imageOverlay}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.timeStyle}>{new Date(`${this.props.viewing.date_time}`).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: true}).toUpperCase()}</Text>
                    <Text style={styles.weekDayStyle}>{this._toDateString(this.props.viewing.date_time)}</Text>
                  </View>
                </View>
                <View style={styles.capacityContainer}>
                  <MaterialIcons name={this.props.viewing.status.status == 'ACTIVE' ? "check-circle-outline" : 'alert-circle-outline' } style={this.props.viewing.status.status == 'ACTIVE' ? styles.confirmationIcon : styles.warningIcon }/>
                  <Text style={styles.capacityText}>
                    {
                      this.props.viewing.status.status == 'ACTIVE' ?
                      'Your viewing is confirmed. It\'s time to invite people to join your live stream!' :
                      'This viewing is cancelled'
                    }
                  </Text>
                </View>
                <View style={styles.buttonContainer}>
                   {
                     this.props.viewing.status.status == 'ACTIVE' ?
                      <TouchableHighlight style={styles.ctaBtnGreen} onPress={() => {this.props.joinLiveCast()}}>
                        <Text style={styles.ctaText}>
                            Start Live Stream
                        </Text>
                      </TouchableHighlight> :
                      <TouchableHighlight style={styles.ctaBtnDisabled} onPress={() => {}}>
                          <Text style={styles.ctaText}>
                              Start Live Stream
                          </Text>
                      </TouchableHighlight>
                   }
                  
                </View>
                {
                  this.props.viewing.status.status == 'ACTIVE' ?
                  <TouchableHighlight style={styles.buttonContainer} onPress={() => {this.setState({showForm: true})}}>
                      <View style={styles.buttonTextContainer}>
                          <Text style={styles.buttonText}>Invite a viewer via Email</Text>
                          <MaterialIcons name="account-plus" style={styles.buttonIconMaterial}/>
                      </View>
                  </TouchableHighlight> :
                  <TouchableHighlight style={styles.buttonContainer} onPress={() => {}}>
                      <View style={styles.buttonTextContainer}>
                          <Text style={styles.buttonText}>Invite a viewer via Email</Text>
                          <MaterialIcons name="account-plus" style={styles.buttonIconMaterial}/>
                      </View>
                  </TouchableHighlight>
                }
            </ScrollView>
            <View style={styles.deleteViewingContainer}>
            {
              this.props.viewing.status.status == 'ACTIVE' ?
              <TouchableHighlight style={styles.deleteButton} onPress={() => {this._showModal()}}>
                <Text style={styles.deleteViewingText}>Cancel Viewing</Text> 
              </TouchableHighlight> :
              <TouchableHighlight style={styles.deleteButtonDisabled} onPress={() => {}}>
                <Text style={styles.deleteViewingText}>Cancel Viewing</Text> 
              </TouchableHighlight>
            }
            </View>
            {
              !this.state.showForm ? 
                  null :
                  <View>
                      <TouchableHighlight style={styles.formOverlay} onPress={() => {this._resetEmailInvitation()}}><Text></Text></TouchableHighlight>
                      <View style={styles.formContainer}>
                          <GenericTextControl 
                            value={this.state.invitationEmail}
                            handleChange={(value) => { this.setState({invitationEmail: value})}} 
                            title="Email"
                            description="Insert the recipients email here" />
                            <TouchableHighlight style={styles.primaryCtaBtnGreen} onPress={() => {this._sendViewingInvitation()}}>
                              <Text style={styles.ctaText}>Send Invitation</Text>
                            </TouchableHighlight> 
                      </View>
                  </View>
                }
            {
              !this.state.showCancelDialogue ? null :
              <ModalBox 
                close={() => this.setState({showCancelDialogue: false})}
                delete={() => this.props.deleteViewing()}
                description="Are you sure you want to cancel this viewing?"
                deleteText="Cancel Viewing"
              />
            }
            {
              !this.state.showStatusBox ? null :
              <StatusBox 
                close={() => {this.setState({showStatusBox: false})}}
                isSuccess={this.state.isStatusSuccess}
                text={this.state.statusBoxText}
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
    goBack: PropTypes.func.isRequired,
    sendInvitationEmail: PropTypes.func.isRequired
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
  ctaBtnDisabled: {
    backgroundColor: Colors.VERY_LIGHT_GRAY,
    flex: 1,
    justifyContent: 'center',
    margin: 10,
    height: 60,
    borderRadius: 10
  },
  primaryCtaBtnGreen: {
    backgroundColor: Colors.AQUA_GREEN,
    flex: 0.2,
    justifyContent: 'center',
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
  deleteButtonDisabled: {
    flex: 1,
    backgroundColor: Colors.VERY_LIGHT_GRAY,
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
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  capacityText: {
    fontSize: FontSizes.DEFAULT,
    color: Colors.LIGHT_GRAY,
    marginLeft: 10,
  },
  confirmationIcon: {
    fontSize: 32,
    color: Colors.AQUA_GREEN
  },
  warningIcon: {
    fontSize: 32,
    color: Colors.RED
  },
  backButton: {
    flex: 0.1,
    alignSelf: 'center'
  },
  backButtonIcon: {
    fontSize: 45,
    color: Colors.AQUA_GREEN,
  },
  formOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignSelf: 'center',
    height:  Dimensions.get('window').height,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  formContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    alignSelf: 'center',
    flex: 1,
    height:  400,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
});