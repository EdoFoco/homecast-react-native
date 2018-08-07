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
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight
} from 'react-native';

class ViewingsContainer extends Component{
 
    _goToViewing(viewingId, property){
       this.props.goToGuestViewingsScreen(viewingId, property);
       this.props.navigation.navigate('ViewingsStack');
      }

      
    _toDateString(date){
        let weekday = new Date(`${date}`).toLocaleString('en-us', {  weekday: 'short' });
        let day = new Date(`${date}`).getDate();
        let month = new Date(`${date}`).toLocaleString('en-us', {  month: 'short' });

        return `${weekday}, ${day} ${month}`;
      }
    
    _renderRow = function({item}){
        let viewing = item;
        let property = this.props.properties.find(p => p.viewings.find( v => v.id == viewing.id));
        return (
          <TouchableHighlight onPress={() => {this._goToViewing(viewing.id, property)}}>
            <View style={styles.viewingContainer}>
                <View style={styles.badge}></View>
                <View style={styles.viewingDateContainer}>
                    <Text style={styles.viewingTime}>{new Date(`${viewing.date_time}`).toLocaleString([], {hour: '2-digit', minute:'2-digit', hour12: true}).toUpperCase()}</Text>
                </View> 
                <View style={styles.detailsContainer}>
                  <MCIcon name="check-circle" style={styles.icon} />
                  <Text style={styles.descriptionText}>{property.address.split(',')[0]}</Text>
                  <Text style={styles.participantsLabel}>{10 - viewing.capacity} Attendee(s)</Text>
                </View>
                
            </View>
          </TouchableHighlight>
          )
      }
    
      _renderViewingsByDate(item){
        var date = item.item;
        var viewings = this.props.viewings.filter(v => {
          let dateText = this._toDateString(v.date_time);
          return dateText === date;
        });

        return(
          <View>
            <View style={styles.dividerContainer}>
              <Text style={styles.dividerText}>{this._toDateString(date)}</Text>
            </View>
            <FlatList
                data={viewings}
                renderItem={(viewing) => this._renderRow(viewing)}
                keyExtractor={(item, index) => index.toString()}
                removeClippedSubviews={false}
              />
          </View>
        )
      }

      render() {
        if(this.props.viewings.length == 0) {
          return(
            <View style={styles.noViewingsContainer}>
              <View style={{height: 25, backgroundColor: Colors.DARK_BLUE}}></View>
              <Text style={styles.noViewingsMessage}>You haven't created any viewings. Choose a property and create a live viewing.</Text>
            </View>
          )
        }
    
        return (
          <View style={styles.container}>
            <View style={{height: 25, backgroundColor: Colors.DARK_BLUE}}></View>

            <FlatList
              data={this.props.dates}
              renderItem={(date) => this._renderViewingsByDate(date)}
              keyExtractor={(item, index) => index.toString()}
              removeClippedSubviews={false}
            />
            
            <NetworkErrorMessage isVisible={this.props.network.hasError} showError={(show) => {this.props.showNetworkError(show)}} />
          </View>
    
        )
      }
}

ViewingsContainer.navigationOptions = {
  tabBarLabel: 'Viewings',
  tabBarIcon: ({ tintColor }) => (
      <Icon name="calendar-clock"  size={24} color={tintColor} style={{height: 24, width: 24}} />
    ),
};

const mapStateToProps = (state) => {
    var properties = [...state.properties.propertiesList];
    var viewings = properties.map(p => p.viewings);
    viewings = [].concat.apply([], viewings);

    var sortedViewings = viewings.sort((a, b) => {
        return new Date(a.date_time) - new Date(b.date_time);
    });

    var dates = [...new Set(sortedViewings.map(v => {
      let weekday = new Date(`${v.date_time}`).toLocaleString('en-us', {  weekday: 'short' });
      let day = new Date(`${v.date_time}`).getDate();
      let month = new Date(`${v.date_time}`).toLocaleString('en-us', {  month: 'short' });
      let year = new Date(`${v.date_time}`).toLocaleString('en-us', {  year: 'numeric' });
      return `${weekday}, ${day} ${month}`;
    }))];
   
    return {
        user: state.user,
        network: state.network,
        viewings: sortedViewings,
        properties: state.properties.propertiesList,
        dates: dates
    }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingsContainer);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  viewingDateContainer: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderColor: Colors.VERY_LIGHT_GRAY
  },
  viewingTime:{
      fontSize: FontSizes.DEFAULT,
      color: Colors.DARK_GREY,
      fontWeight: 'bold',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  dateStyle:{
      fontSize: FontSizes.DEFAULT,
      color: Colors.LIGHT_GRAY,
      flex: 0.3,
      textAlign: 'left',
  },
  viewingContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.LIGHT_GRAY,
    flex: 1,
    flexDirection: 'row',
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
  },
  detailsContainer: {
     flex: 0.7
  },
  participantsContainer:{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
  },
  participants: {
      fontSize: FontSizes.DEFAULT,
      color: Colors.LIGHT_GRAY
  },
  participantsLabel: {
      fontSize: FontSizes.DEFAULT,
      color: Colors.LIGHT_GRAY,
      marginTop: 10,
      marginLeft:20
  },
  dividerContainer: {
    backgroundColor: Colors.WHITE_SMOKE,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
  },
  dividerText: {
    fontSize: FontSizes.DEFAULT, 
    color: Colors.LIGHT_GRAY,
    fontWeight: 'bold'
  },
  badge: {
    backgroundColor: Colors.AQUA_GREEN,
    height: 80,
    width: 10
  },
  descriptionText: {
    marginLeft: 20,
    marginTop: 10,
    marginRight: 10,
    fontSize: FontSizes.DEFAULT
  },
  icon: {
    color: Colors.AQUA_GREEN,
    position: 'absolute',
    left: -12,
    fontSize: 22,
    top: 15,
    backgroundColor: 'white'
  }
});