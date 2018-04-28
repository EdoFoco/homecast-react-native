import React, { Component} from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as Colors from '../../../helpers/ColorPallette';
import * as FontSizes from '../../../helpers/FontSizes';
import DateCell from '../../shared/DateCell';
import ViewingRow from '../../shared/ViewingRow';
import NetworkErrorMessage from '../../shared/NetworkErrorMessage';
import FastImage from 'react-native-fast-image';

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

  _goToViewing(viewing){
    this.props.navigation.navigate('Viewing', { viewingId : viewing.id, property: viewing.property });
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
      <TouchableHighlight onPress={() => {this._goToViewing(reservation.viewing)}}>
        <View>
              <FastImage style={styles.propertyThumb} source={{url: reservation.viewing.property.thumbnail}} />
              <View style={{flexDirection: 'row',  padding: 20, paddingTop: 10}}>
                <View style={styles.propertyDescriptionWrapper}>
                  <Text style={styles.propertyTitle}>{reservation.viewing.property.name}</Text>
                  <Text style={styles.descriptionText}>{reservation.viewing.property.address}</Text>
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
  title: 'Upcoming Viewings',
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
    height: 200
  },
  propertyDescriptionWrapper: {
    flex: 0.6
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
    flex: 0.4,
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
  }
});