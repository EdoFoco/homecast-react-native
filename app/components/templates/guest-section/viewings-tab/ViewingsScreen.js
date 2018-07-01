import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight
} from 'react-native';

class ViewingsScreen extends Component{

  componentWillMount(){
    this.props.getViewingReservations(this.props.user.info.id)
    .catch((error) => {
      console.error(error);
    })
  }

  _goToViewing(viewingId, property){
    this.props.goToGuestViewingsScreen(viewingId, property);
    this.props.navigation.navigate('ViewingsStack');
  }

  _toDateString(date){
    let weekday = new Date(`${date}`).toLocaleString('en-us', {  weekday: 'short' });
    let day = new Date(`${date}`).getDate();
    let month = new Date(`${date}`).toLocaleString('en-us', {  month: 'short' });
    let year = new Date(`${date}`).toLocaleString('en-us', {  year: 'numeric' });

    return `${weekday}, ${day} ${month}`;
  }

  _renderRow = function({item}){
    let reservation = item;
    return (
      <TouchableHighlight onPress={() => {this._goToViewing(reservation.viewing.id, reservation.viewing.property)}}>
        <View style={styles.viewingContainer}>
              <FastImage style={styles.propertyThumb} source={{url: reservation.viewing.property.images[0].url}} />
              <View style={styles.propertyDescriptionWrapper}>
                <View style={styles.leftWrapper}>
                    <View style={styles.priceWrapper}>
                        <Text style={styles.price}>£{Math.round(reservation.viewing.property.price)}</Text>
                        <Text style={styles.priceUnit}>/month</Text>
                    </View>
                    <Text style={styles.descriptionText}>{reservation.viewing.property.address.replace(', UK', '')}</Text>
                </View>
                <View style={styles.rightWrapper}>
                    <View style={styles.iconsContainer}>
                        <View style={styles.iconWrapper}>
                            <FontAwesomeIcon name="bed" style={styles.descriptionIcon} /> 
                            <Text style={styles.iconText}>{reservation.viewing.property.bedrooms} beds</Text>
                        </View>
                        <View style={styles.iconWrapper}>
                            <FontAwesomeIcon name="bath" style={styles.descriptionIcon} /> 
                            <Text style={styles.iconText}>{reservation.viewing.property.bathrooms} baths</Text>
                        </View>
                    </View>
                  </View>
                </View>
                <View style={styles.viewingsContainer}>
                    <MaterialCommunityIcon name="calendar-clock" style={styles.videoIcon} />
                    <View style={styles.viewingTitleWrapper}>
                        <Text style={styles.viewingsTitle}> Viewing Confirmed </Text>
                    </View>
                    <View style={styles.viewingDateContainer}>
                      <Text style={styles.viewingTime}>{new Date(`${reservation.viewing.date_time}`).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: true}).toUpperCase()}</Text>
                      <Text style={styles.dateStyle}>{this._toDateString(reservation.viewing.date_time)}</Text>
                  </View>                        
                </View>
                             </View>
      </TouchableHighlight>
      )
  }

  render() {
    if(this.props.viewingReservations.length == 0) {
      return(
        <View style={styles.noViewingsContainer}>
          <Text style={styles.noViewingsMessage}>You haven't reserved a spot for any property. Choose a property and reserve a spot for a Live viewing.</Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
         <FlatList
          data={this.props.viewingReservations}
          renderItem={(reservation) => this._renderRow(reservation)}
          keyExtractor={(item, index) => index.toString()}
          removeClippedSubviews={false}
        />
        <NetworkErrorMessage isVisible={this.props.network.hasError} showError={(show) => {this.props.showNetworkError(show)}} />
      </View>

    )
  }
  
}

ViewingsScreen.navigationOptions = {
  tabBarLabel: 'Viewings',
  tabBarIcon: ({ tintColor }) => (
      <Icon name="calendar-clock"  size={24} color={tintColor} style={{height: 24, width: 24}} />
    ),
};


const mapStateToProps = (state) => {
   return {
     user: state.user,
     viewingReservations: state.viewings.viewingReservations,
     network: state.network
   }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingsScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  viewingRow:{
    flex: 1,
    alignSelf: 'stretch',
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomColor: Colors.LIGHT_GRAY,
    //borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewingDateCell: {
    width: 100,
    alignSelf: 'flex-start',
  },
  propertyName: {
    fontSize: FontSizes.DEFAULT,
    textAlign: 'left',
    flex: 1,
    paddingLeft: 10,
  },
  viewingTime:{
    flex: 0.7,
    fontSize: FontSizes.DEFAULT,
    textAlign: 'right',
    color: Colors.DARK_GREY,
    paddingRight: 10
  },
  propertyThumb: {
    height: 250,
    borderRadius: 5
  },
  propertyDescriptionWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 20
  },
  propertyTitle: {
      color: Colors.DARK_GREY,
      fontSize: FontSizes.DEFAULT
  },
  descriptionText: {
      color: Colors.VERY_LIGHT_GRAY,
      fontSize: FontSizes.SMALL_TEXT
  }, 
  weekDayStyle: {
    color: 'white',
    fontSize: FontSizes.DEFAULT,
  },
  viewingDateContainer: {
    flex: 0.3,
  },
  viewingTime:{
      fontSize: FontSizes.DEFAULT,
      textAlign: 'center',
      color: Colors.DARK_GREY,
      alignSelf: 'flex-end'
  },
  dateStyle:{
      fontSize: FontSizes.SMALL_TEXT,
      color: Colors.VERY_LIGHT_GRAY,
      flex: 1,
      textAlign: 'center',
      alignSelf: 'flex-end'
  },
  viewingContainer: {
    padding: 10,
    paddingTop: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.LIGHT_GRAY,
    paddingBottom: 20
  },
  priceWrapper: {
    flexDirection: 'row',
  },
  price: {
    fontSize: FontSizes.TITLE,
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: FontSizes.DEFAULT,
    paddingTop: 7
  },
  iconWrapper: {
    alignItems: 'center'
  },
  leftWrapper: {
    flex: 0.7,
  },
  rightWrapper: {
    flex: 0.3
  },
  iconsContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  descriptionIcon: {
    fontSize: FontSizes.DEFAULT,
    color: Colors.DARK_GREY
  },
  iconText: {
    marginLeft: 5,
    marginRight:10,
    color: Colors.DARK_GREY,
  },
  viewingsContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
},
viewingTitleWrapper: {
    marginTop: 0,
    borderRadius: 5,
    flex: 0.7,
    justifyContent: 'center',
    justifyContent: 'flex-start'
},
viewingsTitle: {
    color: Colors.LIGHT_GRAY,
    fontSize: FontSizes.DEFAULT,
    alignSelf: 'flex-start',
},
videoIcon: {
   color: Colors.AQUA_GREEN,
   fontSize: FontSizes.TITLE,
   alignSelf: 'flex-start',
},
noViewingsContainer: {
  flex: 1,
  backgroundColor: 'white',
  justifyContent: 'center',
  paddingRight: 40,
  paddingLeft: 40
},
noViewingsMessage: {
  color: Colors.LIGHT_GRAY,
  alignSelf: 'center',
  fontSize: FontSizes.DEFAULT,
  textAlign: 'center'
}
});